package vacancy

import (
	"context"
	"errors"

	"hunter-platform/internal/domain"
	vacancydto "hunter-platform/internal/dto/vacancy"
	"hunter-platform/internal/mapper"
	"hunter-platform/internal/matching"
	"hunter-platform/internal/repository"
)

var (
	ErrForbidden          = errors.New("forbidden")
	ErrInvalidSalaryRange = errors.New("invalid salary range")
	ErrVacancyNotFound    = errors.New("vacancy not found")
	ErrInvalidSkillLevel  = errors.New("skill level must be between 1 and 5")
	ErrEmployerNotFound   = errors.New("employer profile not found")
)

type Service struct {
	vacancyRepo    repository.VacancyRepository
	employerRepo   repository.EmployerRepository
	skillRepo      repository.SkillRepository
	candidateRepo  repository.CandidateRepository
	matchingSvc    matching.Service
}

func NewService(
	vacancyRepo repository.VacancyRepository,
	employerRepo repository.EmployerRepository,
	skillRepo repository.SkillRepository,
	candidateRepo repository.CandidateRepository,
	matchingSvc matching.Service,
) *Service {
	return &Service{
		vacancyRepo:   vacancyRepo,
		employerRepo:  employerRepo,
		skillRepo:     skillRepo,
		candidateRepo: candidateRepo,
		matchingSvc:   matchingSvc,
	}
}

func (s *Service) Create(
	userID uint64,
	role string,
	title string,
	description string,
	salaryFrom uint32,
	salaryTo uint32,
	workFormat domain.WorkFormat,
) (*domain.Vacancy, error) {
	if role != string(domain.RoleEmployer) {
		return nil, ErrForbidden
	}

	employer, err := s.employerRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	if employer == nil {
		return nil, ErrEmployerNotFound
	}

	if salaryFrom > salaryTo {
		return nil, ErrInvalidSalaryRange
	}

	v := &domain.Vacancy{
		EmployerID:  userID,
		Title:       title,
		Description: description,
		SalaryFrom:  salaryFrom,
		SalaryTo:    salaryTo,
		WorkFormat:  workFormat,
		IsActive:    true,
	}

	if err := s.vacancyRepo.Create(v); err != nil {
		return nil, err
	}

	return v, nil
}

func (s *Service) GetByID(vacancyID uint64) (*domain.Vacancy, error) {
	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrVacancyNotFound
	}

	return v, nil
}

func (s *Service) GetByEmployer(userID uint64) ([]domain.Vacancy, error) {
	return s.vacancyRepo.GetByEmployer(userID)
}

func (s *Service) GetPublicVacancies() ([]vacancydto.VacancyListItemResponse, error) {
	vacancies, err := s.vacancyRepo.ListActive()
	if err != nil {
		return nil, err
	}

	result := make([]vacancydto.VacancyListItemResponse, 0, len(vacancies))
	for _, vacancy := range vacancies {
		company, err := s.getEmployerCompanyName(vacancy.EmployerID)
		if err != nil {
			return nil, err
		}

		result = append(result, mapper.MapVacancyListItem(vacancy, company))
	}

	return result, nil
}

func (s *Service) GetPublicVacancyByID(vacancyID uint64, candidateUserID *uint64) (*vacancydto.VacancyDetailResponse, error) {
	vacancy, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return nil, err
	}
	if vacancy == nil || !vacancy.IsActive {
		return nil, ErrVacancyNotFound
	}

	company, err := s.getEmployerCompanyName(vacancy.EmployerID)
	if err != nil {
		return nil, err
	}

	vacancySkills, err := s.vacancyRepo.GetSkills(vacancyID)
	if err != nil {
		return nil, err
	}

	vacancySkillNames, err := s.getVacancySkillNamesMap(vacancySkills)
	if err != nil {
		return nil, err
	}

	var matchResponse *vacancydto.MatchResponse

	if candidateUserID != nil {
		profile, err := s.candidateRepo.GetProfileByUserID(*candidateUserID)
		if err != nil {
			return nil, err
		}

		if profile != nil {
			candidateSkills, err := s.candidateRepo.GetSkillsByUserID(*candidateUserID)
			if err != nil {
				return nil, err
			}

			candidateSkillNames, err := s.getCandidateSkillNamesMap(candidateSkills)
			if err != nil {
				return nil, err
			}

			matchingCandidate := mapper.MapCandidateProfileToMatching(
				*profile,
				candidateSkills,
				candidateSkillNames,
			)

			matchingVacancy := mapper.MapVacancyToMatching(
				*vacancy,
				vacancySkills,
				vacancySkillNames,
			)

			matchResult, err := s.matchingSvc.MatchCandidateToVacancy(
				context.Background(),
				matchingVacancy,
				matchingCandidate,
			)
			if err != nil {
				return nil, err
			}

			matchResponse = mapper.MapMatchingResultToVacancyMatchResponse(matchResult)
		}
	}

	response := mapper.MapVacancyDetail(
		*vacancy,
		company,
		vacancySkills,
		vacancySkillNames,
		matchResponse,
	)

	return &response, nil
}

func (s *Service) Update(
	userID uint64,
	vacancyID uint64,
	title string,
	description string,
	salaryFrom uint32,
	salaryTo uint32,
	workFormat domain.WorkFormat,
	isActive bool,
) error {
	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return err
	}
	if v == nil {
		return ErrVacancyNotFound
	}

	if v.EmployerID != userID {
		return ErrForbidden
	}

	if salaryFrom > salaryTo {
		return ErrInvalidSalaryRange
	}

	v.Title = title
	v.Description = description
	v.SalaryFrom = salaryFrom
	v.SalaryTo = salaryTo
	v.WorkFormat = workFormat
	v.IsActive = isActive

	return s.vacancyRepo.Update(v)
}

func (s *Service) UpsertSkill(
	userID uint64,
	vacancyID uint64,
	skillID uint64,
	level uint8,
	isRequired bool,
) error {
	if level < 1 || level > 5 {
		return ErrInvalidSkillLevel
	}

	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return err
	}
	if v == nil {
		return ErrVacancyNotFound
	}

	if v.EmployerID != userID {
		return ErrForbidden
	}

	skill := &domain.VacancySkill{
		VacancyID:     vacancyID,
		SkillID:       skillID,
		RequiredLevel: level,
		IsRequired:    isRequired,
	}

	return s.vacancyRepo.UpsertSkill(skill)
}

func (s *Service) DeleteSkill(
	userID uint64,
	vacancyID uint64,
	skillID uint64,
) error {
	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return err
	}
	if v == nil {
		return ErrVacancyNotFound
	}

	if v.EmployerID != userID {
		return ErrForbidden
	}

	return s.vacancyRepo.DeleteSkill(vacancyID, skillID)
}

func (s *Service) GetSkills(vacancyID uint64) ([]domain.VacancySkill, error) {
	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrVacancyNotFound
	}

	return s.vacancyRepo.GetSkills(vacancyID)
}

func (s *Service) getEmployerCompanyName(employerUserID uint64) (string, error) {
	employer, err := s.employerRepo.GetByUserID(employerUserID)
	if err != nil {
		return "", err
	}
	if employer == nil {
		return "", nil
	}

	return employer.CompanyName, nil
}

func (s *Service) getVacancySkillNamesMap(vacancySkills []domain.VacancySkill) (map[uint64]string, error) {
	result := make(map[uint64]string, len(vacancySkills))

	for _, vacancySkill := range vacancySkills {
		if _, exists := result[vacancySkill.SkillID]; exists {
			continue
		}

		skill, err := s.skillRepo.GetByID(vacancySkill.SkillID)
		if err != nil {
			return nil, err
		}
		if skill == nil {
			result[vacancySkill.SkillID] = ""
			continue
		}

		result[vacancySkill.SkillID] = skill.Name
	}

	return result, nil
}

func (s *Service) getCandidateSkillNamesMap(candidateSkills []domain.CandidateSkill) (map[uint64]string, error) {
	result := make(map[uint64]string, len(candidateSkills))

	for _, candidateSkill := range candidateSkills {
		if _, exists := result[candidateSkill.SkillID]; exists {
			continue
		}

		skill, err := s.skillRepo.GetByID(candidateSkill.SkillID)
		if err != nil {
			return nil, err
		}
		if skill == nil {
			result[candidateSkill.SkillID] = ""
			continue
		}

		result[candidateSkill.SkillID] = skill.Name
	}

	return result, nil
}