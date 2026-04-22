import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

function formatRupiah(amount: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(amount))
}

type IFinanceSummaryProps = {
  balance: number | string
  incomeThisMonth: number | string
  expensesThisMonth: number | string
}

const FinanceSummary = ({ balance, incomeThisMonth, expensesThisMonth }: IFinanceSummaryProps) => {
  return (
    <div className="m-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Saldo Kas</CardTitle>
          <CardAction><CircleDollarSign /></CardAction>
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-2xl font-bold text-green-700">
            {formatRupiah(balance)}
          </div>
          <div className="text-sm text-gray-500">Saldo Tersedia</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pemasukan Bulan Ini</CardTitle>
          <CardAction><TrendingUp /></CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatRupiah(incomeThisMonth)}
          </div>
          <div className="text-sm text-gray-500">Total pemasukan</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran Bulan Ini</CardTitle>
          <CardAction><TrendingDown /></CardAction>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatRupiah(expensesThisMonth)}
          </div>
          <div className="text-sm text-gray-500">Total pengeluaran</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Selisih Bulan Ini</CardTitle>
          <CardAction><Wallet /></CardAction>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${Number(incomeThisMonth) - Number(expensesThisMonth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatRupiah(Number(incomeThisMonth) - Number(expensesThisMonth))}
          </div>
          <div className="text-sm text-gray-500">Pemasukan - Pengeluaran</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FinanceSummary
