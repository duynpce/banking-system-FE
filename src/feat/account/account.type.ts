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
  number: string;
  balance: number;
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
  type: z.enum(AccountType,"Account type:invalid account type"),
  username: z.string().min(3, "Username:need at least 3 characters").trim(),
  password: z.string()
  .min(8, "Password:need at least 8 characters")
  .regex(/[a-z]/, "Password:need 1 lowercase letter")
  .regex(/[A-Z]/, "Password:need 1 uppercase letter")
  .regex(/[0-9]/, "Password:need 1 digit")
  .regex(/[@$!%*?&]/, "Password:need 1 special character"),
  email: z.email("Email:invalid email format").trim(),
  phoneNumber: z.string().min(10, "Phone number:need at least 10 characters").max(11, "Phone number:can have at most 11 characters")
  .regex(/^\d+$/, "Phone number:invalid format")
  .trim(),
  address: z.string().trim()
});


export const CreatePersonalAccountRequestSchema = baseCreateAccountSchema.extend({
  type: z.literal(AccountType.PERSONAL),
  gender : z.enum(Gender, "Gender:invalid gender"),
  fullName: z.string().min(3, "Full name:need at least 3 characters").trim(),
  idCardNumber: z.string().min(9, "Id card number:need at least 9 characters").max(15, "Id card number:can have at most 15 characters").trim(),
  dateOfBirth: z.string()
    .trim()
    .refine((date) => !Number.isNaN(Date.parse(date)), "Date of birth:invalid date format")
    .refine((dateOfBirth) => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);

      let age = today.getFullYear() - birthDate.getFullYear();
      const hasNotHadBirthdayYet =
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

      if (hasNotHadBirthdayYet) {
        age -= 1;
      }

      return age >= 18;
    }, "Date of birth:must be at least 18 years old")
});

export const CreateBusinessAccountRequestSchema = baseCreateAccountSchema.extend({
  type: z.literal(AccountType.BUSINESS),
  gender: z.enum(Gender, "Gender:invalid gender"),
  organizationName: z.string().min(3, "Organization name:need at least 3 characters").trim(),
  taxIdNumber: z.string().min(10, "Tax id number:need at least 10 characters").max(15, "Tax id number:can have at most 15 characters").trim(),
});

export const CreateGovernmentAccountRequestSchema = baseCreateAccountSchema.extend({
  type: z.literal(AccountType.GOVERNMENT),
  governmentDepartment: z.string().min(3, "Government department:need at least 3 characters").trim(),
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
  type: z.enum(AccountType,"Account type:invalid account type"),
  email: z.email("Email:invalid email format").trim(),
  phoneNumber: z.string().min(10, "Phone number:need at least 10 characters").max(11, "Phone number:can have at most 11 characters").trim(),
  address: z.string().trim()
});

export const UpdatePersonalAccountRequestSchema = BaseUpdateAccountRequestSchema.extend({
  type: z.literal(AccountType.PERSONAL),
  fullName: z.string().min(3, "Full name:need at least 3 characters").trim(),
  idCardNumber: z.string().min(9, "Id card number:need at least 9 characters").max(12, "Id card number:can have at most 12 characters").trim(),
  dateOfBirth: z.string()
    .trim()
    .refine((date) => !Number.isNaN(Date.parse(date)), "Date of birth:invalid date format")
    .refine((dateOfBirth) => {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);

      let age = today.getFullYear() - birthDate.getFullYear();
      const hasNotHadBirthdayYet =
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

      if (hasNotHadBirthdayYet) {
        age -= 1;
      }

      return age >= 18;
    }, "Date of birth:must be at least 18 years old")
});

export const UpdateBusinessAccountRequestSchema = BaseUpdateAccountRequestSchema.extend({
  type: z.literal(AccountType.BUSINESS),
  organizationName: z.string().min(3, "Organization name:need at least 3 characters").trim(),
  taxIdNumber: z.string().min(10, "Tax id number:need at least 10 characters").max(12, "Tax id number:can have at most 12 characters").trim(),
});

export const UpdateGovernmentAccountRequestSchema = BaseUpdateAccountRequestSchema.extend({
  type: z.literal(AccountType.GOVERNMENT),
  governmentDepartment: z.string().min(3, "Government department:need at least 3 characters").trim(),
});


export const updateAccountRequestSchema = z.discriminatedUnion("type", [
  UpdatePersonalAccountRequestSchema,
  UpdateBusinessAccountRequestSchema,
  UpdateGovernmentAccountRequestSchema
]);

export type UpdateAccountRequest = z.infer<typeof updateAccountRequestSchema>;

export const editPasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, "Current password:is required"),
  newPassword: z
    .string()
    .min(8, "New password:need at least 8 characters")
    .regex(/[a-z]/, "New password:need 1 lowercase letter")
    .regex(/[A-Z]/, "New password:need 1 uppercase letter")
    .regex(/[0-9]/, "New password:need 1 digit")
    .regex(/[@$!%*?&]/, "New password:need 1 special character"),
});

export type EditPasswordRequest = z.infer<typeof editPasswordRequestSchema>;
