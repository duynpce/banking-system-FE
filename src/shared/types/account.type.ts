export const AccountType = {
  BUSINESS: "BUSINESS",
  PERSONAL: "PERSONAL",
  GOVERNMENT : "GOVERNMENT"
}

export type AccountType = typeof AccountType[keyof typeof AccountType];