import {
  CreatePenyediaJasaData,
  penyediaJasaApi,
} from '@/lib/api/penyedia-jasa'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreatePenyediaJasa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePenyediaJasaData) => penyediaJasaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penyedia-jasa'] })
    },
  })
}
