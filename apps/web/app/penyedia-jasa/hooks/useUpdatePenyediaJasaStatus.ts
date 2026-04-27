import {
  penyediaJasaApi,
  UpdatePenyediaJasaStatusData,
} from '@/lib/api/penyedia-jasa'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdatePenyediaJasaStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdatePenyediaJasaStatusData
    }) => penyediaJasaApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penyedia-jasa'] })
    },
  })
}
