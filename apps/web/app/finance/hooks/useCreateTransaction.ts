import { transactionsApi } from '@/lib/api/transactions'
import { transactionSchema } from '../schema'
import { z } from 'zod'

type TransactionInput = z.input<typeof transactionSchema>

export const useCreateTransaction = () => {
  const createTransaction = async (value: TransactionInput) => {
    const parsed = transactionSchema.parse(value)

    await transactionsApi.create({
      type: parsed.type as 'IN' | 'OUT',
      category: parsed.category,
      amount: parsed.amount,
      description: parsed.desc,
      date: new Date().toISOString().slice(0, 10),
    })
  }

  return { createTransaction }
}
