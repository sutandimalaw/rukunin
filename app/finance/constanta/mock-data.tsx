import { CATEGORY, Transaction } from "../interface";
const today = new Date()
const formatDate = (date: Date) =>
  date.toISOString().split("T")[0]

export const data: Transaction[] = [
  {
    id: "m5gr84i9",
    date: formatDate(today),
    category: CATEGORY.IN,
    amount: "Rp 200.000",
    desc: "Iuran Januari",
    balance : "Rp 200.000"
  },
  {
    id: "3u1reuv4",
    date: formatDate(today),
    category: CATEGORY.OUT,
    amount: "Rp 50.000",
    desc: "Iuran Februari",
    balance : "Rp 150.000"
  },
  {
    id: "derv1ws0",
    date: formatDate(today),
    category: CATEGORY.IN,
    amount: "Rp 100.000",
    desc: "Iuran Maret",
    balance : "Rp 250.000"
  },
  {
    id: "5kma53ae",
    date: formatDate(today),
    category: CATEGORY.IN,
    amount: "Rp 100.000",
    desc: "Iuran April",
    balance : "Rp 350.000"
  },
  {
    id: "bhqecj4p",
    date: formatDate(today),
    category: CATEGORY.OUT,
    amount: "Rp 500.000",
    desc: "Iuran Mei",
    balance : "Rp 300.000"
  },
]