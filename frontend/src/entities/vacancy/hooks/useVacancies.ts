import { useCallback, useEffect, useState } from "react";
import type { Vacancy } from "@/entities/vacancy/types";
import { getVacancies } from "@/entities/vacancy/api";

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVacancies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getVacancies();
      setVacancies(data);
    } catch {
      setError("Не удалось загрузить вакансии");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVacancies();
  }, [loadVacancies]);

  return {
    vacancies,
    loading,
    error,
    reload: loadVacancies,
  };
};
