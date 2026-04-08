import { z } from "zod";
import { AccountType } from "../account/account.type";
import { CardType } from "./card.type";

export interface CardPrivilegeDto {
	id: number;
	privilegeCode: string;
	accountType: AccountType;
	cardType: CardType;
	annualFee: number;
	cashbackRate: number;
	expirationYears: number;
	spendingLimitDaily: number;
	effectiveFrom: string;
	effectiveTo: string;
}

export const CreateCardPrivilegeRequestSchema = z.object({
	code: z.string().trim().toUpperCase().min(1, "Code: is required"),
	expirationYears: z
		.number("Expiration years: must be a number")
		.int("Expiration years: must be an integer")
		.min(1, "Expiration years: must be at least 1"),
	spendingLimitDaily: z
		.number("Spending limit daily: must be a number")
		.min(0, "Spending limit daily: must be greater than or equal to 0"),
	annualFee: z
		.number("Annual fee: must be a number")
		.min(0, "Annual fee: must be greater than or equal to 0"),
	cashbackRate: z
		.number("Cashback rate: must be a number")
		.min(0, "Cashback rate: must be greater than or equal to 0"),
	accountType: z.enum(AccountType, "Account type:invalid account type"),
	cardType: z.enum(CardType, "Card type:invalid card type"),
	effectiveFrom: z
		.string()
		.trim()
		.refine((date) => !Number.isNaN(Date.parse(date)), "Effective from:invalid date format"),
	effectiveTo: z
		.string()
		.trim()
		.refine((date) => !Number.isNaN(Date.parse(date)), "Effective to:invalid date format"),
}).refine(
	(data) => new Date(data.effectiveTo).getTime() >= new Date(data.effectiveFrom).getTime(),
	{
		message: "Effective to: must be greater than or equal to effective from",
		path: ["effectiveTo"],
	}
);

export type CreateCardPrivilegeRequest = z.infer<typeof CreateCardPrivilegeRequestSchema>;

export const UpdateCardPrivilegeRequestSchema = z
	.object({
		id: z
			.number("Id: must be a number")
			.int("Id: must be an integer")
			.min(0, "Id: must be greater than or equal to 0"),
		annualFee: z
			.number("Annual fee: must be a number")
			.min(0, "Annual fee: must be greater than or equal to 0")
			.optional(),
		cashbackRate: z
			.number("Cashback rate: must be a number")
			.min(0, "Cashback rate: must be greater than or equal to 0")
			.optional(),
		expirationYears: z
			.number("Expiration years: must be a number")
			.int("Expiration years: must be an integer")
			.min(1, "Expiration years: must be at least 1")
			.optional(),
		spendingLimitDaily: z
			.number("Spending limit daily: must be a number")
			.min(0, "Spending limit daily: must be greater than or equal to 0")
			.optional(),
		effectiveFrom: z
			.string()
			.trim()
			.refine((date) => !Number.isNaN(Date.parse(date)), "Effective from:invalid date format")
			.optional(),
		effectiveTo: z
			.string()
			.trim()
			.refine((date) => !Number.isNaN(Date.parse(date)), "Effective to:invalid date format")
			.optional(),
	})
	.refine(
		(data) => {
			if (!data.effectiveFrom || !data.effectiveTo) {
				return true;
			}

			return new Date(data.effectiveTo).getTime() >= new Date(data.effectiveFrom).getTime();
		},
		{
			message: "Effective to: must be greater than or equal to effective from",
			path: ["effectiveTo"],
		}
	);

export type UpdateCardPrivilegeRequest = z.infer<typeof UpdateCardPrivilegeRequestSchema>;

export const GetCardPrivilegesQueryRequestSchema = z.object({
	page: z.number("Page: must be a number").int("Page: must be an integer").min(0, "Page: must be at least 0"),
	limit: z.number("Limit: must be a number").int("Limit: must be an integer").min(1, "Limit: must be at least 1"),
	code: z.string().trim().min(1, "Code: is required"),
	accountType: z.enum(AccountType, "Account type:invalid account type"),
	cardType: z.enum(CardType, "Card type:invalid card type"),
});

export type GetCardPrivilegesQueryRequest = z.infer<typeof GetCardPrivilegesQueryRequestSchema>;

export const DeleteCardPrivilegeRequestSchema = z.object({
	code: z.string().trim().min(1, "Code: is required"),
	accountType: z.enum(AccountType, "Account type:invalid account type"),
	cardType: z.enum(CardType, "Card type:invalid card type"),
});

export type DeleteCardPrivilegeRequest = z.infer<typeof DeleteCardPrivilegeRequestSchema>;
