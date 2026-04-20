import { useCallback, useEffect, useState } from "react";
import type { CandidateProfile } from "@/entities/vacancy/types";
import { getCandidateProfile } from "@/entities/vacancy/api";

export const useCandidateProfile = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCandidateProfile();
      setProfile(data);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    setProfile,
    loading,
    error,
    reload: loadProfile,
  };
};