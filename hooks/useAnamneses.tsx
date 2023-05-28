import useSWR, { mutate } from "swr";
import type { ApiResponse, AnamneseCount } from "@/types/base";
import fetcher from "@/lib/fetcher";

const useAnamneses = () => {
    const url = `/api/anamnese`;

    const { data, error } =
        useSWR<ApiResponse<AnamneseCount[]>>(
            url,
            fetcher
        )

    const mutateAnamneses = async () => {
        mutate(url);
    }

    return {
        isLoading: !error && !data,
        isError: error,
        despesas: data?.data,
        mutateAnamneses,
    }
}

export default useAnamneses;