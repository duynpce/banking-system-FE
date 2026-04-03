import { z } from "zod";
import { AccountType } from "../account/account.type";

export const CardType = {
  DEBIT: "DEBIT",
  CREDIT: "CREDIT"
} as const;

export type CardType = typeof CardType[keyof typeof CardType];

export interface CardDto {
  id: string;
  cardNumber: string;
  cardType: CardType;
  expiryDate: string;
  privilege: string;
  cardHolder: string;
}

export const BaseCardRequestSchema = z.object({
  forAccountType : z.enum(AccountType, "For account type:invalid account type").refine((val) => val !== AccountType.GOVERNMENT, {
  message: "Government accounts do not support card creation",}),
  privilegeCode: z.string().trim().toUpperCase(),
  type: z.enum(CardType, "Card type:invalid card type"),
  pinCode: z.string().length(6, "PIN code: must be exactly 6 characters").regex(/^\d{6}$/, "PIN code: must contain only digits").trim(),
});

export const CreatePersonalCardRequestSchema = BaseCardRequestSchema.extend({
  forAccountType: z.literal(AccountType.PERSONAL),
});

export const CreateBusinessCardRequestSchema = BaseCardRequestSchema.extend({
  forAccountType: z.literal(AccountType.BUSINESS),
  holder: z.string().min(3, "Card holder name must be at least 3 characters").trim(),
});

//this schema is just a placeholder to satisfy the discriminated union requirement
export const CreateGovernmentCardRequestSchema = BaseCardRequestSchema.extend({
  forAccountType: z.literal(AccountType.GOVERNMENT),
}).refine(() => false, {
  message: "Government accounts do not support card creation",
});

export const CreateCardRequestSchema = z.discriminatedUnion("forAccountType", [
  CreatePersonalCardRequestSchema,
  CreateBusinessCardRequestSchema,
  CreateGovernmentCardRequestSchema,
]);

export type CreateCardRequest= z.infer<typeof CreateCardRequestSchema>;

