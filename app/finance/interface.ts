export enum CATEGORY {
    IN = "In",
    OUT = "Out"
}

export type Transaction = {
  id: string
  date : string,
  category: CATEGORY,
  amount: string,
  desc: string,
  balance : string
}