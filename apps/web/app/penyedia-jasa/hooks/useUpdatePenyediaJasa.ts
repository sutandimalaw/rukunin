import {
  penyediaJasaApi,
  UpdatePenyediaJasaData,
} from '@/lib/api/penyedia-jasa'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdatePenyediaJasa() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePenyediaJasaData }) =>
      penyediaJasaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penyedia-jasa'] })
    },
  })
}
