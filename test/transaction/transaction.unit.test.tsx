import { AxiosError } from "axios";
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import {
	createTransaction,
	getTransactionByPage,
	getTransactionsByDateRange,
	getWeeklyTransactions,
	toLocalDateString,
} from "../../src/feat/transaction/transaction.service";
import { TransactionType } from "../../src/feat/transaction/transaction.type";

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
		const request = {
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
		const request = {
			receiverAccountNumber: "123456789012",
			description: "Monthly rent transfer",
			transferredAmount: 1500,
			type: TransactionType.TRANSFER,
		};

		const error = new AxiosError("network error");
		mockPost.mockRejectedValue(error);

		await expect(createTransaction(request)).rejects.toThrow("network error");
	});

	test("getTransactionsByDateRange should call endpoint with formatted date params", async () => {
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
		const startDate = new Date("2026-04-01T00:00:00.000Z");
		const endDate = new Date("2026-04-16T00:00:00.000Z");

		mockGet.mockResolvedValue({ data: payload });

		const result = await getTransactionsByDateRange(startDate, endDate);

		expect(result).toEqual(payload);
		expect(mockGet).toHaveBeenCalledWith("/v1/transactions", {
			params: {
				startDate: toLocalDateString(startDate),
				endDate: toLocalDateString(endDate),
			},
		});
	});

	test("getTransactionsByDateRange should throw when api.get fails", async () => {
		const error = new AxiosError("unauthorized");
		mockGet.mockRejectedValue(error);

		await expect(getTransactionsByDateRange("2026-04-01", "2026-04-16")).rejects.toThrow("unauthorized");
	});

	test("getWeeklyTransactions should call endpoint with 7-day range", async () => {
		const endDate = new Date("2026-04-16T00:00:00.000Z");

		mockGet.mockResolvedValue({ data: [] });

		await getWeeklyTransactions(endDate);

		expect(mockGet).toHaveBeenCalledWith("/v1/transactions", {
			params: {
				startDate: toLocalDateString("2026-04-09"),
				endDate: toLocalDateString(endDate),
			},
		});
	});

	test("getTransactionByPage should call endpoint correctly", async () => {
		mockGet.mockResolvedValue({ data: [] });

		const result = await getTransactionByPage(1, 10);

		expect(result).toEqual([]);
		expect(mockGet).toHaveBeenCalledWith("/v1/transactions", {
			params: { page: 1, limit: 10 },
		});
	});
});
