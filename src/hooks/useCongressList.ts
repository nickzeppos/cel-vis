import { useState, useEffect } from "react";
import { getCongressList } from "@/services/api";

export function useCongressList() {
  const [congressList, setCongressList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCongressList() {
      try {
        setIsLoading(true);
        const congresses = await getCongressList();
        setCongressList(congresses);
      } catch (err) {
        console.error("Error fetching congress list:", err);
        setError("Failed to load congress list");
      } finally {
        setIsLoading(false);
      }
    }

    setCongressList([]);
    setError(null);
    setIsLoading(true);
    fetchCongressList();
  }, []);

  return { congressList, isLoading, error };
}
