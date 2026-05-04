import { z } from "zod";

export const LoanFineType = {
  OVERDUE_PAYMENT: "OVERDUE_PAYMENT",
  EARLY_PAYMENT: "EARLY_PAYMENT",
} as const;

export const LoanFineStatus = {
  UNPAID: "UNPAID",
  PAID: "PAID",
} as const;

export type LoanFineStatus = typeof LoanFineStatus[keyof typeof LoanFineStatus];

export type LoanFineType = typeof LoanFineType[keyof typeof LoanFineType];

export interface LoanFineDto {
  id: number;
  loanId: number;
  amount: number;
  createdAt: string;
  type: LoanFineType;
  status: LoanFineStatus;
}

export const CreateLoanFineRequestSchema = z.object({
  loanId: z.number().int().min(1, "Loan: must select a valid loan"),
  amount: z.number().min(0.01, "Amount: must be at least 0.01"),
  type: z.enum([LoanFineType.OVERDUE_PAYMENT, LoanFineType.EARLY_PAYMENT], "Type: invalid fine type"),
  accountId: z.number().int().min(1, "Account: must select a valid account"),
  loanFinePolicyId: z.number().int().min(1, "Fine policy: must select a valid fine policy"),
});

export type CreateLoanFineRequest = z.infer<typeof CreateLoanFineRequestSchema>;

export const UpdateLoanFineRequestSchema = z.object({
  id: z.number().int().min(1, "ID: must be a positive integer"),
  amount: z.number().min(0.01, "Amount: must be at least 0.01").optional(),
  type: z.enum([LoanFineType.OVERDUE_PAYMENT, LoanFineType.EARLY_PAYMENT], "Type: invalid fine type").optional(),
});

export type UpdateLoanFineRequest = z.infer<typeof UpdateLoanFineRequestSchema>;