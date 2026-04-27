import { Badge } from '@/components/ui/badge'
import {
  getPosisiLabel,
  getPosisiLevel,
  type PosisiPengurus,
} from '@/lib/api/pengurus'

interface Props {
  posisi: PosisiPengurus
  customPosisi?: string | null
}

export function PosisiBadge({ posisi, customPosisi }: Props) {
  const label = getPosisiLabel(posisi, customPosisi)
  const level = getPosisiLevel(posisi)

  const variant: 'default' | 'secondary' | 'outline' =
    level === 0 ? 'default' : level <= 2 ? 'secondary' : 'outline'

  return <Badge variant={variant}>{label}</Badge>
}
