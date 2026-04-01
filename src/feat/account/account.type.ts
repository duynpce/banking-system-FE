import z from "zod";
//move to account folder later when create account feat
export const AccountType = {
  BUSINESS: "BUSINESS",
  PERSONAL: "PERSONAL",
  GOVERNMENT : "GOVERNMENT"
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

export const Gender = {
  FEMALE: "FEMALE",
  MALE: "MALE",
  OTHER: "OTHER",
  UNKNOWN: "UNKNOWN"
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const AccountStatus = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
  BLOCKED: "BLOCKED"
} as const;

export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];

// OpenAPI: components.schemas.GetAccountResponse
export type AccountDto = {
  id: number;
  email: string;
  phoneNumber: string;
  address: string;
  type: AccountType;
  status: AccountStatus;
};

export type PersonalAccountDto = AccountDto & {
type: typeof AccountType.PERSONAL;
fullName: string;
idCardNumber: string;
dateOfBirth: string;
gender: Gender;
};

export type BusinessAccountDto = AccountDto & {
type: typeof AccountType.BUSINESS;
organizationName: string;
taxIdNumber: string;
};

export type GovernmentAccountDto = AccountDto & {
type: typeof AccountType.GOVERNMENT;
governmentDepartment: string;
};

export type AccountDetailDto =
| PersonalAccountDto
| BusinessAccountDto
| GovernmentAccountDto;



export const baseCreateAccountSchema = z.object({
  type: z.enum(AccountType,"invalid account type"),
  username: z.string().min(3, "need at least 3 characters").trim(),
  password: z.string()
  .min(8, "need at least 8 characters")
  .regex(/[a-z]/, "need 1 lowercase letter")
  .regex(/[A-Z]/, "need 1 uppercase letter")
  .regex(/[0-9]/, "need 1 digit")
  .regex(/[@$!%*?&]/, "need 1 special character"),
  email: z.email("invalid email format").trim(),
  phoneNumber: z.string().min(10, "need at least 10 characters").max(11, "can have at most 11 characters").trim(),
  address: z.string().trim()
});


export const CreatePersonalAccountRequestSchema = baseCreateAccountSchema.extend({
  type: z.literal(AccountType.PERSONAL),
  fullName: z.string().min(3, "need at least 3 characters").trim(),
  idCardNumber: z.string().min(9, "need at least 9 characters").max(12, "can have at most 12 characters").trim(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "invalid date format").trim(),
});

export const CreateBusinessAccountRequestSchema = baseCreateAccountSchema.extend({
  type: z.literal(AccountType.BUSINESS),
  organizationName: z.string().min(3, "need at least 3 characters").trim(),
  taxIdNumber: z.string().min(10, "need at least 9 characters").max(12, "can have at most 12 characters").trim(),
});

export const CreateGovernmentAccountRequestSchema = baseCreateAccountSchema.extend({
  type: z.literal(AccountType.GOVERNMENT),
  governmentDepartment: z.string().min(3, "need at least 3 characters").trim(),
});

export const createAccountRequestSchema = z.discriminatedUnion("type", [
  CreatePersonalAccountRequestSchema,
  CreateBusinessAccountRequestSchema,
  CreateGovernmentAccountRequestSchema
]);

export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>;
export type CreatePersonalAccountRequest = z.infer<typeof CreatePersonalAccountRequestSchema>;
export type CreateBusinessAccountRequest = z.infer<typeof CreateBusinessAccountRequestSchema>;
export type CreateGovernmentAccountRequest = z.infer<typeof CreateGovernmentAccountRequestSchema>;



export const BaseUpdateAccountRequestSchema = z.object({
  email: z.email("invalid email format").trim(),
  phoneNumber: z.string().min(10, "need at least 10 characters").max(11, "can have at most 11 characters").trim(),
  address: z.string().trim()
});

export const UpdatePersonalAccountRequestSchema = BaseUpdateAccountRequestSchema.extend({
  fullName: z.string().min(3, "need at least 3 characters").trim(),
  idCardNumber: z.string().min(9, "need at least 9 characters").max(12, "can have at most 12 characters").trim(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "invalid date format").trim(),
});

export const UpdateBusinessAccountRequestSchema = BaseUpdateAccountRequestSchema.extend({
  organizationName: z.string().min(3, "need at least 3 characters").trim(),
  taxIdNumber: z.string().min(9, "need at least 9 characters").max(12, "can have at most 12 characters").trim(),
});

export const UpdateGovernmentAccountRequestSchema = BaseUpdateAccountRequestSchema.extend({
  governmentDepartment: z.string().min(3, "need at least 3 characters").trim(),
});


export const updateAccountRequestSchema = z.discriminatedUnion("type", [
  UpdatePersonalAccountRequestSchema,
  UpdateBusinessAccountRequestSchema,
  UpdateGovernmentAccountRequestSchema
]);

