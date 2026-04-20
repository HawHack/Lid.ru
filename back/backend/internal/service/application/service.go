package application

import (
	"context"
	"errors"

	applicationdto "hunter-platform/internal/dto/application"
	"hunter-platform/internal/domain"
	"hunter-platform/internal/mapper"
	"hunter-platform/internal/matching"
	"hunter-platform/internal/repository"
)

var (
	ErrForbidden           = errors.New("forbidden")
	ErrVacancyNotFound     = errors.New("vacancy not found")
	ErrApplicationNotFound = errors.New("application not found")
	ErrProfileNotFound     = errors.New("candidate profile not found")
)

type Service struct {
	appRepo       repository.ApplicationRepository
	vacancyRepo   repository.VacancyRepository
	candidateRepo repository.CandidateRepository
	employerRepo  repository.EmployerRepository
	skillRepo     repository.SkillRepository
	matchingSvc   matching.Service
}

func NewService(
	appRepo repository.ApplicationRepository,
	vacancyRepo repository.VacancyRepository,
	candidateRepo repository.CandidateRepository,
	employerRepo repository.EmployerRepository,
	skillRepo repository.SkillRepository,
	matchingSvc matching.Service,
) *Service {
	return &Service{
		appRepo:       appRepo,
		vacancyRepo:   vacancyRepo,
		candidateRepo: candidateRepo,
		employerRepo:  employerRepo,
		skillRepo:     skillRepo,
		matchingSvc:   matchingSvc,
	}
}

func (s *Service) Apply(userID uint64, role string, vacancyID uint64) error {
	if role != string(domain.RoleCandidate) {
		return ErrForbidden
	}

	profile, err := s.candidateRepo.GetProfileByUserID(userID)
	if err != nil {
		return err
	}
	if profile == nil {
		return ErrProfileNotFound
	}

	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return err
	}
	if v == nil || !v.IsActive {
		return ErrVacancyNotFound
	}

	app := &domain.Application{
		CandidateID: userID,
		VacancyID:   vacancyID,
		Status:      domain.StatusApplied,
	}

	return s.appRepo.Create(app)
}

func (s *Service) GetMyApplications(userID uint64) ([]applicationdto.CandidateApplicationItemResponse, error) {
	apps, err := s.appRepo.GetByCandidate(userID)
	if err != nil {
		return nil, err
	}

	profile, err := s.candidateRepo.GetProfileByUserID(userID)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, ErrProfileNotFound
	}

	candidateSkills, err := s.candidateRepo.GetSkillsByUserID(userID)
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

	result := make([]applicationdto.CandidateApplicationItemResponse, 0, len(apps))

	for _, app := range apps {
		vacancy, err := s.vacancyRepo.GetByID(app.VacancyID)
		if err != nil {
			return nil, err
		}
		if vacancy == nil {
			continue
		}

		companyName, err := s.getEmployerCompanyName(vacancy.EmployerID)
		if err != nil {
			return nil, err
		}

		vacancySummary := mapper.MapVacancySummary(*vacancy, companyName)

		vacancySkills, err := s.vacancyRepo.GetSkills(vacancy.ID)
		if err != nil {
			return nil, err
		}

		vacancySkillNames, err := s.getVacancySkillNamesMap(vacancySkills)
		if err != nil {
			return nil, err
		}

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

		matchSummary := mapper.MapMatchingResultToApplicationMatchSummary(matchResult)

		result = append(result, mapper.MapCandidateApplicationItem(app, vacancySummary, matchSummary))
	}

	return result, nil
}

func (s *Service) GetByVacancy(userID uint64, vacancyID uint64) ([]applicationdto.EmployerApplicationItemResponse, error) {
	v, err := s.vacancyRepo.GetByID(vacancyID)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, ErrVacancyNotFound
	}

	if v.EmployerID != userID {
		return nil, ErrForbidden
	}

	vacancySkills, err := s.vacancyRepo.GetSkills(vacancyID)
	if err != nil {
		return nil, err
	}

	vacancySkillNames, err := s.getVacancySkillNamesMap(vacancySkills)
	if err != nil {
		return nil, err
	}

	matchingVacancy := mapper.MapVacancyToMatching(*v, vacancySkills, vacancySkillNames)

	apps, err := s.appRepo.GetByVacancy(vacancyID)
	if err != nil {
		return nil, err
	}

	result := make([]applicationdto.EmployerApplicationItemResponse, 0, len(apps))

	for _, app := range apps {
		profile, err := s.candidateRepo.GetProfileByUserID(app.CandidateID)
		if err != nil {
			return nil, err
		}
		if profile == nil {
			continue
		}

		candidateSkills, err := s.candidateRepo.GetSkillsByUserID(app.CandidateID)
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

		matchResult, err := s.matchingSvc.MatchCandidateToVacancy(
			context.Background(),
			matchingVacancy,
			matchingCandidate,
		)
		if err != nil {
			return nil, err
		}

		candidateSummary := mapper.MapCandidateSummary(*profile, s.skillNamesToList(candidateSkillNames))
		matchSummary := mapper.MapMatchingResultToApplicationMatchSummary(matchResult)

		result = append(result, mapper.MapEmployerApplicationItem(app, candidateSummary, matchSummary))
	}

	return result, nil
}

func (s *Service) UpdateStatus(
	userID uint64,
	appID uint64,
	status domain.ApplicationStatus,
) error {
	app, err := s.appRepo.GetByID(appID)
	if err != nil {
		return err
	}
	if app == nil {
		return ErrApplicationNotFound
	}

	v, err := s.vacancyRepo.GetByID(app.VacancyID)
	if err != nil {
		return err
	}
	if v == nil {
		return ErrApplicationNotFound
	}

	if v.EmployerID != userID {
		return ErrForbidden
	}

	app.Status = status

	return s.appRepo.Update(app)
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

func (s *Service) skillNamesToList(skillNames map[uint64]string) []string {
	result := make([]string, 0, len(skillNames))

	for _, name := range skillNames {
		if name == "" {
			continue
		}
		result = append(result, name)
	}

	return result
}