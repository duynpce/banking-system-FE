import { z } from "zod";

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

// OpenAPI: components.schemas.GetTransactionResponse
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

// OpenAPI: components.schemas.CreateTransactionRequest
export const CreateTransactionRequestSchema = z.object({
	receiverAccountNumber: z.string().trim().length(12, "Receiver account number:must be exactly 12 characters"),
	description: z.string().min(10, "Description:must be at least 10 characters").trim(),
	transferredAmount: z.number().min(1, "Transferred amount:must be greater than or equal to 1"),
	type: z.enum(TransactionType, "Transaction type:invalid transaction type"),
});

export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequestSchema>;
