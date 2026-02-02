// lib/date.ts
import { format } from "date-fns"

export const formatTime = (date: string | Date) =>
  format(new Date(date), "HH:mm")

export const formatDate = (date: string | Date) =>
  format(new Date(date), "dd/MM/yyyy")

export const formatDateTime = (date: string | Date) =>
  format(new Date(date), "dd-MM-yyyy HH:mm")