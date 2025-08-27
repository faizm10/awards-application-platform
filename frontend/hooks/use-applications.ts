import { useState, useEffect } from "react";
import { getApplicationsByStudent } from "@/lib/applications";
import { useAuth } from "@/contexts/AuthContext";

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      if (!user) {
        setApplications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userApplications = await getApplicationsByStudent(user.id);
        setApplications(userApplications || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [user]);

  const hasAppliedToAward = (awardId: string) => {
    return applications.some(app => app.award_id === awardId);
  };

  const getApplicationStatus = (awardId: string) => {
    const application = applications.find(app => app.award_id === awardId);
    return application ? application.status : null;
  };

  return {
    applications,
    loading,
    error,
    hasAppliedToAward,
    getApplicationStatus,
  };
}
