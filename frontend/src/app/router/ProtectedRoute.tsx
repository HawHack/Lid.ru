import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import type { ReactElement } from "react";

type Role = "candidate" | "employer" | "admin";

type Props = {
  children: ReactElement;
  allowed: Role[];
};

export const ProtectedRoute = ({ children, allowed }: Props) => {
  const role = useAuthStore((s) => s.role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};