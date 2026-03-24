export const CardType = {
  DEBIT: "DEBIT",
  CREDIT: "CREDIT"
};

export type CardType = typeof CardType[keyof typeof CardType];

export interface CardDto {
  id: string;
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  privilege: string;
  cardHolder: string;
}

export interface CreateCardRequest {
  privilegeCode: string;
  type: CardType;
  pinCode: string;
}

