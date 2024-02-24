import useSwr from 'swr';

import fetcher from '@/lib/fetcher2';

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSwr(
    'http://localhost:3000/api/current',
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
