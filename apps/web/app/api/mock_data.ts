import { PAYMENT, PAYMENT_STATUS } from "../utils/data-type";

export const dataSource: PAYMENT[] = [
  {
    id: "m5gr84i9",
    name: "irvan",
    blok: "SB2",
    rt: "4",
    periode_bayar: "-",
    status_bayar: PAYMENT_STATUS.NOT_PAID,
    amount: 0,
    terlambat: "",
    tagihan: "",
    no: "22"
  },
  {
    id: "3u1reuv4",
    amount: 242,
    name: "fauzan",
    blok: "4",
    rt: "",
    periode_bayar: "",
    status_bayar: PAYMENT_STATUS.PAID,
    terlambat: "",
    tagihan: "",
    no: "3"
  },
  {
    id: "derv1ws0",
    amount: 837,
    name: "erik",
    blok: "sb-3",
    rt: "4",
    periode_bayar: "",
    status_bayar: PAYMENT_STATUS.PAID,
    terlambat: "",
    tagihan: "",
    no: "5"
  },
  {
    id: "5kma53ae",
    amount: 874,
    name: "friska",
    blok: "sb 2",
    rt: "sb-4",
    periode_bayar: "",
    status_bayar: PAYMENT_STATUS.PAID,
    terlambat: "",
    tagihan: "",
    no: "4"
  },
  {
    id: "bhqecj4p",
    amount: 721,
    name: "",
    blok: "sb5",
    rt: "4",
    periode_bayar: "",
    status_bayar: PAYMENT_STATUS.NOT_PAID,
    terlambat: "",
    tagihan: "",
    no: ""
  },
  {
    id: "bhqecj4p",
    amount: 721,
    name: "saras",
    blok: "sb1",
    rt: "4",
    periode_bayar: "",
    status_bayar: PAYMENT_STATUS.PAID,
    terlambat: "",
    tagihan: "",
    no: "9"
  }
]