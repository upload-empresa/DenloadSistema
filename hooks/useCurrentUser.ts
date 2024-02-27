import useSwr from 'swr';

import fetcher from '@/lib/fetcher2';

const useCurrentUser = (siteId: any) => {
  const { data, error, isLoading, mutate } = useSwr(
    `http://localhost:3000/api/current?siteId=${siteId}`,
    fetcher
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
