//move to account folder later when create account feat

export const AccountType = {
  BUSINESS: "BUSINESS",
  PERSONAL: "PERSONAL",
  GOVERNMENT : "GOVERNMENT"
}

export type AccountType = typeof AccountType[keyof typeof AccountType];

export const Gender = {
  FEMALE: "FEMALE",
  MALE: "MALE",
  OTHER: "OTHER",
  UNKNOWN: "UNKNOWN"
}

export type Gender = typeof Gender[keyof typeof Gender];

export const AccountStatus = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
  BLOCKED: "BLOCKED"
}

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

// Parent DTO: fields shared by all account create requests.
export type CreateAccountRequest = {
  type: AccountType;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  address: string;
};

// Parent DTO: fields shared by all account update requests.
export type UpdateAccountRequest = {
  email: string;
  phoneNumber: string;
  address: string;
};


