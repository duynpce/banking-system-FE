import { z } from "zod";
import type { PaginationDto } from "../../../shared/dto/request.dto";

export const LoanType = {
  MORTGAGE: "MORTGAGE",
  CREDIT: "CREDIT",
} as const;

export type LoanType = typeof LoanType[keyof typeof LoanType];

export const LoanStatus = {
  CURRENT_PAYMENT: "CURRENT_PAYMENT",
  OVERDUE_PAYMENT: "OVERDUE_PAYMENT",
  DONE_PAYMENT: "DONE_PAYMENT",
} as const;

export type LoanStatus = typeof LoanStatus[keyof typeof LoanStatus];

export interface LoanFilter {
  paginationDto: PaginationDto;
  status?: LoanStatus;
  loanType?: LoanType;
  startDate?: string;
  endDate?: string;
}

export interface LoanDto {
  id: number;
  totalAmount: number;
  leftAmount: number;
  dueDate: string;
  status: LoanStatus;
  type: LoanType;
  createdAt: string;
  durationMonths: number;
  interestRate: number;
}

export interface LoanReportDto {
  loanStatus: LoanStatus;
  totalAmount: number;
  leftAmount: number;
  monthlyInstallment: number;
}

export const CreateLoanRequestSchema = z.object({
  amount: z.number().min(0.01, "Amount: must be at least 0.01"),
  type: z.enum([LoanType.MORTGAGE, LoanType.CREDIT], "Type: invalid loan type"),
  policyId: z.number().int().min(1, "Policy: must select a valid policy"),
});

export type CreateLoanRequest = z.infer<typeof CreateLoanRequestSchema>;

export const RepayLoanRequestSchema = z.object({
  loanId: z.number().int().min(1, "Loan: must select a valid loan"),
  amount: z.number().min(0.0001, "Repay amount: must be at least 0.0001"),
});

export type RepayLoanRequest = z.infer<typeof RepayLoanRequestSchema>;
