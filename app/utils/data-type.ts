
export enum PAYMENT_STATUS {
    PAID = "LUNAS",
    NOT_PAID ="BELUM BAYAR"

}

export type PAYMENT = {
  id: string
  name : string
  blok : string
  no : string
  rt: string
  periode_bayar: string
  status_bayar: PAYMENT_STATUS
  amount: number;
  terlambat : string;
  tagihan : string;
}