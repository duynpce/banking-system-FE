import { z } from "zod";
import { LoanFineType } from "../domain/loan.fine.type";

export interface LoanFinePolicyDto {
  id: number;
  type: LoanFineType;
  amount: number;
  effectiveFrom: string;
  effectiveTo: string;
  createdAt: string;
}

export const CreateLoanFinePolicyRequestSchema = z.object({
  loanFineType: z.enum([LoanFineType.OVERDUE_PAYMENT, LoanFineType.EARLY_PAYMENT], "Fine type: invalid fine type"),
  amount: z.number().min(0.01, "Amount: must be at least 0.01"),
  effectiveFrom: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective from: invalid date"),
  effectiveTo: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective to: invalid date"),
});

export type CreateLoanFinePolicyRequest = z.infer<typeof CreateLoanFinePolicyRequestSchema>;

export const UpdateLoanFinePolicyRequestSchema = z.object({
  id: z.number().int().min(1, "ID: must be a positive integer"),
  loanFineType: z.enum([LoanFineType.OVERDUE_PAYMENT, LoanFineType.EARLY_PAYMENT], "Fine type: invalid fine type").optional(),
  amount: z.number().min(0.01, "Amount: must be at least 0.01").optional(),
  effectiveFrom: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective from: invalid date").optional(),
  effectiveTo: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Effective to: invalid date").optional(),
});

export type UpdateLoanFinePolicyRequest = z.infer<typeof UpdateLoanFinePolicyRequestSchema>;
