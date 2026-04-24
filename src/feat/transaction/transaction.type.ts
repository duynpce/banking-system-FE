import { z } from "zod";
import type { PaginationDto } from "../../shared/dto/request.dto";

export const TransactionType = {
	DEPOSIT: "DEPOSIT",
	WITHDRAWAL: "WITHDRAWAL",
	TRANSFER: "TRANSFER",
	PAYMENT: "PAYMENT",
	CASHBACK: "CASHBACK",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
	PENDING: "PENDING",
	COMPLETED: "COMPLETED",
	FAILED: "FAILED",
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const TransactionGroup = {
	ALL: "ALL",
	INCOME: "INCOME",
	OUTCOME: "OUTCOME",
} as const;

export type TransactionGroup = typeof TransactionGroup[keyof typeof TransactionGroup];

// OpenAPI: components.schemas.GetTransactionResponse

export interface TransactionFilter {
	paginationDto: PaginationDto;
	transactionGroup: TransactionGroup;
	type?: TransactionType;
	status?: TransactionStatus;
	startDate?: string;
	endDate?: string;
}

export interface TransactionDto {
	id: number;
	senderAccountNumber: string;
	receiverAccountNumber: string;
	description: string;
	type: TransactionType;
	status: TransactionStatus;
	transferredAmount: number;
	createdAt: string;
	postedBalance: number;
}

export const TransactionReportType = {
	DAY: "DAY",
	WEEK: "WEEK",
	MONTH: "MONTH",
	YEAR: "YEAR",
} as const;

export type TransactionReportType = typeof TransactionReportType[keyof typeof TransactionReportType];

export interface TransactionReportFilter {
	reportType: TransactionReportType;
	day?: number;
	week?: number;
	month?: number;
	year?: number;
}

export interface TransactionReportDto {
	reportType: TransactionReportType;
	startDate: string;
	endDate: string;
	incomeAmount: number;
	outcomeAmount: number;
	incomeTransferAmount: number;
	outcomeTransferAmount: number;
	cashbackAmount: number;
	paymentAmount: number;
	depositAmount: number;
	withdrawalAmount: number;
}

// OpenAPI: components.schemas.CreateTransactionRequest
export const CreateTransactionRequestSchema = z.discriminatedUnion("type", [
  // account number require (transfer, payment)
  z.object({
    type: z.enum([TransactionType.TRANSFER, TransactionType.PAYMENT]),
    description: z.string().min(10).trim(),
    transferredAmount: z.number().min(1),
    receiverAccountNumber: z.string().length(12).regex(/^\d+$/),
  }),
  // account number not require (deposit, withdrawal, cashback)
  z.object({
    type: z.enum([TransactionType.DEPOSIT, TransactionType.WITHDRAWAL, TransactionType.CASHBACK]),
    description: z.string().min(10).trim(),
    transferredAmount: z.number().min(1),
  }),
]);


export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequestSchema>;
