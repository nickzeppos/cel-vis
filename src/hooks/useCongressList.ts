import { useState, useEffect } from 'react';
import { getCongressList } from '@/services/api';

export function useCongressList() {
  const [congressList, setCongressList] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCongressList() {
      try {
        const list = await getCongressList();
        setCongressList(list);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch Congress list'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCongressList();
  }, []);

  return { congressList, isLoading, error };
}