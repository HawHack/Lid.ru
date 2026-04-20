import { apiClient } from "@/shared/api/client";
import { handleApiError } from "@/shared/api/handleApi";
import type {
  Vacancy,
  Candidate,
  CandidateStatus,
  CandidateProfile,
  CandidateApplication,
} from "./types";
import type { VacancyDetailDto, VacancyListItemDto } from "./dto";
import {
  mapCandidateApplicationDto,
  mapCandidateDto,
  mapCandidateProfileDto,
  mapVacancyDetailDto,
  mapVacancyListItemDto,
} from "./adapters";

export type AdminMetrics = {
  totalVacancies: number;
  pendingVacancies: number;
  approvedVacancies: number;
  rejectedVacancies: number;
};

export type EmployerMetrics = {
  totalVacancies: number;
  activeVacancies: number;
  totalCandidates: number;
  newCount: number;
  reviewingCount: number;
  interviewCount: number;
  hiredCount: number;
  rejectedCount: number;
};

type EmployerApplicationDto = {
  id: number;
  status: string;
  createdAt: string;
  candidate: {
    userId: number;
    fullName: string;
    about: string;
    location: string;
    experienceYears: number;
    workFormat: string;
    skills: string[];
  };
  match?: {
    score: number;
    recommendation: string;
    missingSkills: {
      id: number;
      name: string;
      requiredLevel: number;
      isRequired: boolean;
    }[];
  };
};

type CandidateProfileApiDto = {
  userID?: number;
  userId?: number;
  fullName: string;
  about: string;
  location: string;
  experienceYears: number;
  workFormat: string;
};

type CandidateApplicationApiDto = {
  id: number;
  status: string;
  createdAt: string;
  vacancy: {
    id: number;
    title: string;
    company: string;
    salaryFrom: number;
    salaryTo: number;
    workFormat: string;
    status: string;
  };
};

type EmployerVacancyApiDto = {
  ID: number;
  EmployerID: number;
  Title: string;
  Description: string;
  SalaryFrom: number;
  SalaryTo: number;
  WorkFormat: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

type CreatedVacancyApiDto = {
  ID: number;
  EmployerID: number;
  Title: string;
  Description: string;
  SalaryFrom: number;
  SalaryTo: number;
  WorkFormat: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

const formatSalary = (salaryFrom: number, salaryTo: number): string => {
  if (salaryFrom > 0 && salaryTo > 0) {
    return `${salaryFrom.toLocaleString("ru-RU")} – ${salaryTo.toLocaleString("ru-RU")} ₽`;
  }

  if (salaryFrom > 0) {
    return `от ${salaryFrom.toLocaleString("ru-RU")} ₽`;
  }

  if (salaryTo > 0) {
    return `до ${salaryTo.toLocaleString("ru-RU")} ₽`;
  }

  return "Доход не указан";
};

const normalizeCandidateStatus = (status: string): CandidateStatus => {
  if (status === "applied") return "applied";
  if (status === "interview") return "interview";
  if (status === "offer") return "offer";
  if (status === "rejected") return "rejected";
  if (status === "reviewing") return "reviewing";
  if (status === "hired") return "hired";
  return "new";
};

const mapEmployerVacancyApiDto = (dto: EmployerVacancyApiDto): Vacancy => {
  return {
    id: dto.ID,
    title: dto.Title,
    company: "Моя компания",
    salary: formatSalary(dto.SalaryFrom, dto.SalaryTo),
    salaryFrom: dto.SalaryFrom,
    salaryTo: dto.SalaryTo,
    workFormat: dto.WorkFormat,
    matchScore: 0,
    description: dto.Description,
    skills: [],
    ownerRole: "employer",
    status: dto.IsActive ? "active" : "archived",
  };
};

const mapStatusForBackend = (status: CandidateStatus): string => {
  if (status === "new" || status === "reviewing" || status === "applied") return "applied";
  if (status === "hired" || status === "offer") return "offer";
  return status;
};

export const getVacancies = async (): Promise<Vacancy[]> => {
  try {
    const res = await apiClient.get<VacancyListItemDto[]>("/vacancies");

    const vacancies = await Promise.all(
      res.data.map(async (item) => {
        try {
          const detailRes = await apiClient.get<VacancyDetailDto>(`/vacancies/${item.id}`);
          return mapVacancyDetailDto(detailRes.data);
        } catch {
          return mapVacancyListItemDto(item);
        }
      })
    );

    return vacancies;
  } catch (error) {
    handleApiError(error, "Не удалось загрузить вакансии");
    return [];
  }
};

export const getVacancyById = async (id: string): Promise<Vacancy | null> => {
  try {
    const res = await apiClient.get<VacancyDetailDto>(`/vacancies/${id}`);
    return mapVacancyDetailDto(res.data);
  } catch (error) {
    handleApiError(error, "Не удалось загрузить вакансию");
    return null;
  }
};

export const applyToVacancy = async (vacancyId: number) => {
  try {
    const res = await apiClient.post(`/candidate/applications/${vacancyId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Не удалось отправить отклик");
    return null;
  }
};

export const getEmployerVacancies = async (): Promise<Vacancy[]> => {
  try {
    const res = await apiClient.get<EmployerVacancyApiDto[]>("/employer/vacancies");
    return res.data.map(mapEmployerVacancyApiDto);
  } catch (error) {
    handleApiError(error, "Не удалось загрузить вакансии работодателя");
    return [];
  }
};

export const createVacancy = async (
  payload: Omit<Vacancy, "id" | "matchScore" | "status" | "salary" | "match">
): Promise<Vacancy | null> => {
  try {
    const res = await apiClient.post<CreatedVacancyApiDto>("/employer/vacancies", {
      title: payload.title,
      description: payload.description,
      salary_from: payload.salaryFrom,
      salary_to: payload.salaryTo,
      work_format: payload.workFormat,
    });

    const createdId = res.data?.ID;
    if (!createdId) {
      return null;
    }

    const createdVacancy = await getVacancyById(String(createdId));
    if (createdVacancy) {
      return createdVacancy;
    }

    return mapEmployerVacancyApiDto({
      ID: res.data.ID,
      EmployerID: res.data.EmployerID,
      Title: res.data.Title,
      Description: res.data.Description,
      SalaryFrom: res.data.SalaryFrom,
      SalaryTo: res.data.SalaryTo,
      WorkFormat: res.data.WorkFormat,
      IsActive: res.data.IsActive,
      CreatedAt: res.data.CreatedAt,
      UpdatedAt: res.data.UpdatedAt,
    });
  } catch (error) {
    handleApiError(error, "Не удалось создать вакансию");
    return null;
  }
};

export const getCandidatesByVacancy = async (vacancyId: string): Promise<Candidate[]> => {
  try {
    const res = await apiClient.get<EmployerApplicationDto[]>(`/employer/vacancies/${vacancyId}/applications`);

    return res.data.map((item) =>
      mapCandidateDto({
        id: item.id,
        name: item.candidate.fullName,
        title: item.candidate.about || item.candidate.location || "Кандидат",
        matchScore: item.match?.score ?? 0,
        skills: item.candidate.skills.map((skill) => ({
          name: skill,
        })),
        status: normalizeCandidateStatus(item.status),
      })
    );
  } catch (error) {
    handleApiError(error, "Не удалось загрузить кандидатов");
    return [];
  }
};

export const updateCandidateStatus = async (
  _vacancyId: string,
  applicationId: number,
  status: CandidateStatus
) => {
  try {
    const res = await apiClient.put(`/employer/applications/${applicationId}/status`, {
      status: mapStatusForBackend(status),
    });
    return res.data;
  } catch (error) {
    handleApiError(error, "Не удалось обновить статус кандидата");
    return null;
  }
};

export const getCandidateProfile = async (): Promise<CandidateProfile | null> => {
  try {
    const [profileRes, skillsRes] = await Promise.all([
      apiClient.get<CandidateProfileApiDto>("/candidate/profile"),
      apiClient.get<{ skill_id?: number; skillId?: number; level: number; name?: string }[]>("/candidate/skills"),
    ]);

    return mapCandidateProfileDto({
      id: profileRes.data.userId ?? profileRes.data.userID ?? 0,
      name: profileRes.data.fullName,
      title: `${profileRes.data.experienceYears} лет опыта`,
      bio: profileRes.data.about,
      location: profileRes.data.location,
      portfolioUrl: "",
      skills: skillsRes.data.map((skill) => ({
        id: skill.skillId ?? skill.skill_id,
        name: skill.name ?? `Навык ${skill.skillId ?? skill.skill_id ?? ""}`.trim(),
        level: skill.level,
      })),
    });
  } catch (error) {
    handleApiError(error, "Не удалось загрузить профиль кандидата");
    return null;
  }
};

export const updateCandidateProfile = async (profile: CandidateProfile): Promise<CandidateProfile | null> => {
  try {
    await apiClient.post("/candidate/profile", {
      full_name: profile.name,
      about: profile.bio,
      location: profile.location,
      experience_years: 0,
      work_format: "remote",
    });

    return await getCandidateProfile();
  } catch (error) {
    handleApiError(error, "Не удалось сохранить профиль кандидата");
    return null;
  }
};

export const getCandidateApplications = async (): Promise<CandidateApplication[]> => {
  try {
    const res = await apiClient.get<CandidateApplicationApiDto[]>("/candidate/applications");

    return res.data.map((item) =>
      mapCandidateApplicationDto({
        id: item.id,
        vacancyId: item.vacancy.id,
        vacancyTitle: item.vacancy.title,
        company: item.vacancy.company,
        status: normalizeCandidateStatus(item.status),
      })
    );
  } catch (error) {
    handleApiError(error, "Не удалось загрузить отклики");
    return [];
  }
};

export const getAdminMetrics = async (): Promise<AdminMetrics> => {
  try {
    const vacancies = await getVacancies();

    return {
      totalVacancies: vacancies.length,
      pendingVacancies: vacancies.filter((v) => v.status === "pending").length,
      approvedVacancies: vacancies.filter((v) => v.status === "active" || v.status === "approved").length,
      rejectedVacancies: vacancies.filter((v) => v.status === "rejected").length,
    };
  } catch {
    return {
      totalVacancies: 0,
      pendingVacancies: 0,
      approvedVacancies: 0,
      rejectedVacancies: 0,
    };
  }
};

export const getAdminVacancies = async (): Promise<Vacancy[]> => {
  try {
    return await getVacancies();
  } catch {
    return [];
  }
};

export const updateVacancyStatus = async (vacancyId: number, status: Vacancy["status"]) => {
  try {
    const current = await getVacancyById(String(vacancyId));
    if (!current) {
      return null;
    }

    const isActive = status === "active" || status === "approved";

    const res = await apiClient.put(`/employer/vacancies/${vacancyId}`, {
      title: current.title,
      description: current.description,
      salary_from: current.salaryFrom,
      salary_to: current.salaryTo,
      work_format: current.workFormat,
      is_active: isActive,
    });

    return res.data;
  } catch (error) {
    handleApiError(error, "Не удалось обновить статус вакансии");
    return null;
  }
};

export const getEmployerMetrics = async (): Promise<EmployerMetrics> => {
  try {
    const vacancies = await getEmployerVacancies();

    return {
      totalVacancies: vacancies.length,
      activeVacancies: vacancies.filter((v) => v.status === "active").length,
      totalCandidates: 0,
      newCount: 0,
      reviewingCount: 0,
      interviewCount: 0,
      hiredCount: 0,
      rejectedCount: 0,
    };
  } catch {
    return {
      totalVacancies: 0,
      activeVacancies: 0,
      totalCandidates: 0,
      newCount: 0,
      reviewingCount: 0,
      interviewCount: 0,
      hiredCount: 0,
      rejectedCount: 0,
    };
  }
};