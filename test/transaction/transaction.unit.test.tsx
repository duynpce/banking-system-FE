import { AxiosError } from "axios";
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import {
	createTransaction,
	getRelativeStartDate,
	getTransactionsByFilter,
	toLocalDateString,
} from "../../src/feat/transaction/transaction.service";
import { TransactionGroup, TransactionType, type CreateTransactionRequest } from '../../src/feat/transaction/transaction.type';

vi.mock("../../src/config/axios/api", () => ({
	api: {
		post: vi.fn(),
		get: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
		defaults: { headers: { common: {} } },
	},
}));

const mockPost = api.post as Mock;
const mockGet = api.get as Mock;

describe("transaction.service unit", () => {
	test("createTransaction should call endpoint correctly", async () => {
		const request:CreateTransactionRequest = {
			receiverAccountNumber: "123456789012",
			description: "Monthly rent transfer",
			transferredAmount: 1500,
			type: TransactionType.TRANSFER,
		};

		mockPost.mockResolvedValue({ message: "create transaction successfully" });

		const result = await createTransaction(request);

		expect(result.message).toBe("create transaction successfully");
		expect(mockPost).toHaveBeenCalledWith("/v1/transactions", request, {
			toastMessageWhenSuccess: true,
		});
	});

	test("createTransaction should throw when api.post fails", async () => {
		const request: CreateTransactionRequest = {
			receiverAccountNumber: "123456789012",
			description: "Monthly rent transfer",
			transferredAmount: 1500,
			type: TransactionType.TRANSFER,
		};

		const error = new AxiosError("network error");
		mockPost.mockRejectedValue(error);

		await expect(createTransaction(request)).rejects.toThrow("network error");
	});

	test("getTransactionsByFilter should call endpoint with transactionFilter params", async () => {
		const signal = new AbortController().signal;
		const filter = {
			paginationDto: {
				page: 0,
				limit: 10,
			},
			transactionGroup: TransactionGroup.ALL,
			startDate: "2026-04-01",
			endDate: "2026-04-16",
		};
		const payload = [
			{
				id: 1,
				senderAccountNumber: "000000000001",
				receiverAccountNumber: "000000000002",
				description: "sample transfer",
				type: TransactionType.TRANSFER,
				status: "COMPLETED",
				transferredAmount: 300,
				createdAt: "2026-04-16T00:00:00Z",
				postedBalance: 1000,
			},
		];

		mockGet.mockResolvedValue({
			data: payload,
			metaData: {
				totalItems: 1,
				totalPages: 1,
				currentPage: 0,
				pageSize: 10,
			},
			success: true,
		});

		const result = await getTransactionsByFilter(filter, signal);

		expect(result.data).toEqual(payload);
		expect(mockGet).toHaveBeenCalledWith("/v1/transactions", {
			signal,
			params: {
				transactionFilter: {
					paginationDto: {
						page: 0,
						limit: 10,
					},
					transactionGroup: TransactionGroup.ALL,
					startDate: "2026-04-01",
					endDate: "2026-04-16",
				},
			},
		});
	});

	test("getTransactionsByFilter should throw when api.get fails", async () => {
		const error = new AxiosError("unauthorized");
		mockGet.mockRejectedValue(error);

		await expect(
			getTransactionsByFilter({
				paginationDto: { page: 0, limit: 10 },
				transactionGroup: TransactionGroup.ALL,
			}),
		).rejects.toThrow("unauthorized");
	});

	test("getRelativeStartDate should return a 7-day range start date for week period", async () => {
		const endDate = new Date("2026-04-16T00:00:00.000Z");
		const startDate = getRelativeStartDate(endDate, "week");

		expect(toLocalDateString(startDate)).toBe("2026-04-09");
	});

	test("toLocalDateString should format DateInput to YYYY-MM-DD", async () => {
		expect(toLocalDateString("2026-04-16T00:00:00.000Z")).toBe("2026-04-16");
	});
});
