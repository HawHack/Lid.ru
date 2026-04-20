import { createBrowserRouter, Navigate } from "react-router-dom";
import CandidatePage from "@/features/candidate/CandidatePage";
import EmployerPage from "@/features/employer/EmployerPage";
import AdminPage from "@/features/admin/AdminPage";
import LoginPage from "@/features/auth/LoginPage";
import VacancyPage from "@/features/candidate/VacancyPage";
import VacancyCandidatesPage from "@/features/employer/VacancyCandidatesPage";
import CandidateProfilePage from "@/features/candidate/CandidateProfilePage";
import CandidateApplicationsPage from "@/features/candidate/CandidateApplicationsPage";
import SavedVacanciesPage from "@/features/candidate/SavedVacanciesPage";
import CandidateGrowthPage from "@/features/candidate/CandidateGrowthPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteErrorPage } from "./RouteErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute allowed={["candidate"]}>
        <CandidatePage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },

  {
    path: "/saved",
    element: <Navigate to="/candidate/saved" replace />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/profile",
    element: <Navigate to="/candidate/profile" replace />,
    errorElement: <RouteErrorPage />,
  },

  {
    path: "/candidate/saved",
    element: (
      <ProtectedRoute allowed={["candidate"]}>
        <SavedVacanciesPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/candidate/profile",
    element: (
      <ProtectedRoute allowed={["candidate"]}>
        <CandidateProfilePage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/candidate/applications",
    element: (
      <ProtectedRoute allowed={["candidate"]}>
        <CandidateApplicationsPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/candidate/growth",
    element: (
      <ProtectedRoute allowed={["candidate"]}>
        <CandidateGrowthPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },

  {
    path: "/employer",
    element: (
      <ProtectedRoute allowed={["employer"]}>
        <EmployerPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/employer/profile",
    element: (
      <ProtectedRoute allowed={["employer"]}>
        <EmployerPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowed={["admin"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },

  {
    path: "/vacancy/:id",
    element: (
      <ProtectedRoute allowed={["candidate"]}>
        <VacancyPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/employer/vacancies/:id/candidates",
    element: (
      <ProtectedRoute allowed={["employer"]}>
        <VacancyCandidatesPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorPage />,
  },

  {
    path: "*",
    element: <RouteErrorPage />,
  },
]);