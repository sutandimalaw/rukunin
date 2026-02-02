import { createClient } from '@/lib/supabase/client'
import { transactionSchema } from '../schema'
import { z } from 'zod'

type TransactionInput = z.input<typeof transactionSchema>

export const useCreateTransaction = () => {
  const createTransaction = async (value: TransactionInput) => {
    const supabase = createClient()

    // validasi domain
    transactionSchema.parse(value)

    const { error } = await supabase.rpc('add_transaction_v2', {
      p_date: new Date().toISOString().slice(0, 10),
      p_type: value.type,
      p_amount: value.amount,
      p_description: value.desc,
      p_category: value.category,
    })

    if (error) throw error
  }

  return { createTransaction }
}