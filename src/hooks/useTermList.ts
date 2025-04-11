import { useState, useEffect } from "react";
import { getTermList } from "@/services/api";
import { StateTerm } from "@/lib/types";

export function useTermList(state: string) {
  const [termList, setTermList] = useState<Array<StateTerm>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTermList(state: string) {
      try {
        setIsLoading(true);
        const terms = await getTermList(state);
        setTermList(terms);
      } catch (err) {
        console.error("Error fetching term list:", err);
        setError("Failed to load term list");
      } finally {
        setIsLoading(false);
      }
    }

    setTermList([]);
    setError(null);
    setIsLoading(true);
    fetchTermList(state);
  }, [state]);

  return { termList, isLoading, error };
}
