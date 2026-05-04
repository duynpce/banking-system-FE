import { z } from "zod";
import { LoanType } from "../domain/loan.type";

export interface LoanPolicyDto {
  id: number;
  durationMonths: number;
  interestRate: number;
  loanType: LoanType;
  effectiveFrom: string;
  effectiveTo: string;
  createdAt: string;
  maxAmount: number;
}

export const CreateLoanPolicyRequestSchema = z.object({
  durationMonths: z.number().int().min(1, "Duration months: must be at least 1"),
  interestRate: z.number().min(0.01, "Interest rate: must be greater than 0"),
  maxAmount: z.number().min(0.01, "Max amount: must be at least 0.01").optional(),
  loanType: z.enum([LoanType.MORTGAGE, LoanType.CREDIT], "Loan type: invalid loan type"),
  effectiveFrom: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective from: invalid date"),
  effectiveTo: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective to: invalid date"),
});

export type CreateLoanPolicyRequest = z.infer<typeof CreateLoanPolicyRequestSchema>;

export const UpdateLoanPolicyRequestSchema = z.object({
  id: z.number().int().min(1, "ID: must be a positive integer"),
  durationMonths: z.number().int().min(1, "Duration months: must be at least 1").optional(),
  interestRate: z.number().min(0, "Interest rate: must be non-negative").optional(),
  loanType: z.enum([LoanType.MORTGAGE, LoanType.CREDIT], "Loan type: invalid loan type").optional(),
  effectiveFrom: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective from: invalid date").optional(),
  effectiveTo: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective to: invalid date").optional(),
});

export type UpdateLoanPolicyRequest = z.infer<typeof UpdateLoanPolicyRequestSchema>;
