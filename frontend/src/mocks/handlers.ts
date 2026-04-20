import { http, HttpResponse } from "msw";

let vacancies = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Corp",
    salary: "$1000–2000",
    matchScore: 82,
    description:
      "We are looking for a Frontend Developer with strong React and TypeScript skills to build modern interfaces.",
    skills: [
      { name: "React", level: 4, matched: true },
      { name: "TypeScript", level: 4, matched: true },
      { name: "GraphQL", level: 2, matched: false },
    ],
    ownerRole: "employer",
    status: "approved",
  },
  {
    id: 2,
    title: "UI Engineer",
    company: "Product Studio",
    salary: "$1500–2500",
    matchScore: 74,
    description:
      "We need a UI Engineer who can build polished design systems and production-ready interfaces.",
    skills: [
      { name: "Figma", level: 3, matched: true },
      { name: "Tailwind", level: 4, matched: true },
      { name: "Vue", level: 2, matched: false },
    ],
    ownerRole: "employer",
    status: "pending",
  },
];

let candidateProfile = {
  id: 1,
  name: "Maria Ivanova",
  title: "Frontend Developer",
  bio: "Frontend developer focused on React, TypeScript and modern UI systems.",
  location: "Moscow",
  portfolioUrl: "https://portfolio.example.com",
  skills: [
    { name: "React", level: 5 },
    { name: "TypeScript", level: 4 },
    { name: "Tailwind", level: 4 },
  ],
};

let candidateApplications = [
  {
    id: 1,
    vacancyId: 1,
    vacancyTitle: "Frontend Developer",
    company: "Tech Corp",
    status: "reviewing",
  },
];

let candidatesByVacancy: Record<number, any[]> = {
  1: [
    {
      id: 101,
      name: "Anna Petrova",
      title: "Frontend Developer",
      matchScore: 91,
      status: "new",
      skills: [
        { name: "React", level: 5, matched: true },
        { name: "TypeScript", level: 4, matched: true },
        { name: "GraphQL", level: 3, matched: true },
      ],
    },
    {
      id: 102,
      name: "Ivan Smirnov",
      title: "UI Engineer",
      matchScore: 76,
      status: "reviewing",
      skills: [
        { name: "React", level: 4, matched: true },
        { name: "TypeScript", level: 3, matched: true },
        { name: "GraphQL", level: 1, matched: false },
      ],
    },
  ],
  2: [
    {
      id: 201,
      name: "Elena Volkova",
      title: "Design Systems Engineer",
      matchScore: 88,
      status: "interview",
      skills: [
        { name: "Figma", level: 5, matched: true },
        { name: "Tailwind", level: 4, matched: true },
        { name: "Vue", level: 2, matched: true },
      ],
    },
  ],
};

export const handlers = [
  http.get("/vacancies", () => {
    const approvedVacancies = vacancies.filter(
      (vacancy) => vacancy.status === "approved"
    );
    return HttpResponse.json(approvedVacancies);
  }),

  http.get("/vacancies/:id", ({ params }) => {
    const vacancy = vacancies.find((item) => item.id === Number(params.id));

    if (!vacancy || vacancy.status !== "approved") {
      return new HttpResponse("Not found", { status: 404 });
    }

    return HttpResponse.json(vacancy);
  }),

  http.post("/applications", async ({ request }) => {
    const body = (await request.json()) as { vacancyId: number };

    const vacancy = vacancies.find((v) => v.id === body.vacancyId);

    if (vacancy) {
      candidateApplications = [
        ...candidateApplications,
        {
          id: candidateApplications.length + 1,
          vacancyId: vacancy.id,
          vacancyTitle: vacancy.title,
          company: vacancy.company,
          status: "new",
        },
      ];
    }

    return HttpResponse.json({
      success: true,
      message: "Application sent",
      data: body,
    });
  }),

  http.get("/candidate/profile", () => {
    return HttpResponse.json(candidateProfile);
  }),

  http.put("/candidate/profile", async ({ request }) => {
    const body = await request.json();
    candidateProfile = body as typeof candidateProfile;
    return HttpResponse.json(candidateProfile);
  }),

  http.get("/candidate/applications", () => {
    return HttpResponse.json(candidateApplications);
  }),

  http.get("/employer/vacancies", () => {
    const employerVacancies = vacancies.filter(
      (vacancy) => vacancy.ownerRole === "employer"
    );

    return HttpResponse.json(employerVacancies);
  }),

  http.post("/employer/vacancies", async ({ request }) => {
    const body = (await request.json()) as Omit<
      (typeof vacancies)[number],
      "id" | "matchScore" | "status"
    >;

    const newVacancy = {
      id: vacancies.length + 1,
      matchScore: 0,
      status: "pending",
      ...body,
      ownerRole: "employer",
    };

    vacancies = [...vacancies, newVacancy];
    candidatesByVacancy[newVacancy.id] = [];

    return HttpResponse.json(newVacancy, { status: 201 });
  }),

  http.get("/employer/vacancies/:id/candidates", ({ params }) => {
    const vacancyId = Number(params.id);
    return HttpResponse.json(candidatesByVacancy[vacancyId] || []);
  }),

  http.patch(
    "/employer/vacancies/:id/candidates/:candidateId",
    async ({ params, request }) => {
      const vacancyId = Number(params.id);
      const candidateId = Number(params.candidateId);
      const body = (await request.json()) as { status: string };

      const candidates = candidatesByVacancy[vacancyId] || [];
      const candidateIndex = candidates.findIndex((c) => c.id === candidateId);

      if (candidateIndex === -1) {
        return new HttpResponse("Not found", { status: 404 });
      }

      candidates[candidateIndex] = {
        ...candidates[candidateIndex],
        status: body.status,
      };

      candidatesByVacancy[vacancyId] = [...candidates];

      return HttpResponse.json(candidates[candidateIndex]);
    }
  ),

  http.get("/employer/metrics", () => {
    const employerVacancies = vacancies.filter(
      (vacancy) => vacancy.ownerRole === "employer"
    );

    const allCandidates = Object.values(candidatesByVacancy).flat();

    const metrics = {
      totalVacancies: employerVacancies.length,
      totalCandidates: allCandidates.length,
      newCount: allCandidates.filter((c) => c.status === "new").length,
      reviewingCount: allCandidates.filter((c) => c.status === "reviewing")
        .length,
      interviewCount: allCandidates.filter((c) => c.status === "interview")
        .length,
      hiredCount: allCandidates.filter((c) => c.status === "hired").length,
      rejectedCount: allCandidates.filter((c) => c.status === "rejected")
        .length,
    };

    return HttpResponse.json(metrics);
  }),

  http.get("/admin/vacancies", () => {
    return HttpResponse.json(vacancies);
  }),

  http.patch("/admin/vacancies/:id", async ({ params, request }) => {
    const vacancyId = Number(params.id);
    const body = (await request.json()) as { status: string };

    const vacancyIndex = vacancies.findIndex((v) => v.id === vacancyId);

    if (vacancyIndex === -1) {
      return new HttpResponse("Not found", { status: 404 });
    }

    vacancies[vacancyIndex] = {
      ...vacancies[vacancyIndex],
      status: body.status,
    };

    return HttpResponse.json(vacancies[vacancyIndex]);
  }),

  http.get("/admin/metrics", () => {
    const metrics = {
      totalVacancies: vacancies.length,
      pendingVacancies: vacancies.filter((v) => v.status === "pending").length,
      approvedVacancies: vacancies.filter((v) => v.status === "approved").length,
      rejectedVacancies: vacancies.filter((v) => v.status === "rejected").length,
    };

    return HttpResponse.json(metrics);
  }),
];