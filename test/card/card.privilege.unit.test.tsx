import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import {
	createCardPrivilege,
	deleteCardPrivilege,
	deleteCardPrivilegeById,
	getCardPrivilegeById,
	getCardPrivilegesByCodeAndAccountTypeAndCardTypeQuery,
	
	updateCardPrivilege,
} from "../../src/feat/card/card.privilege.service";
import type { CreateCardPrivilegeRequest, DeleteCardPrivilegeRequest, GetCardPrivilegesQueryRequest } from "../../src/feat/card/card.privilege.type";

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
const mockPut = api.put as Mock;
const mockDelete = api.delete as Mock;

describe("card.privilege.service unit", () => {
	test("createCardPrivilege should call create endpoint and return response data", async () => {
		const request: CreateCardPrivilegeRequest = {
			code: "GOLD",
			expirationYears: 7,
			spendingLimitDaily: 5000,
			annualFee: 200,
			cashbackRate: 1.5,
			accountType: "PERSONAL",
			cardType: "CREDIT",
			effectiveFrom: "2026-01-01",
			effectiveTo: "2030-01-01",
		};

		mockPost.mockResolvedValue({ message: "create card privilege successfully" });

		const result = await createCardPrivilege(request);

		expect(result.message).toBe("create card privilege successfully");
		expect(mockPost).toHaveBeenCalledWith("/v1/card-privileges", request, {
			toastMessageWhenSuccess: true,
		});
	});

	test("createCardPrivilege should throw when api.post fails", async () => {
		const request: CreateCardPrivilegeRequest = {
			code: "GOLD",
			expirationYears: 7,
			spendingLimitDaily: 5000,
			annualFee: 200,
			cashbackRate: 1.5,
			accountType: "PERSONAL",
			cardType: "CREDIT",
			effectiveFrom: "2026-01-01",
			effectiveTo: "2030-01-01",
		};

		const error = new Error("network error");
		mockPost.mockRejectedValue(error);

		await expect(createCardPrivilege(request)).rejects.toThrow("network error");
		expect(mockPost).toHaveBeenCalledTimes(1);
	});

	test("updateCardPrivilege should call update endpoint and return response data", async () => {
		const request = {
			id: 1,
			annualFee: 250,
			cashbackRate: 2,
		};

		mockPut.mockResolvedValue({ message: "update card privilege successfully" });

		const result = await updateCardPrivilege(request);

		expect(result.message).toBe("update card privilege successfully");
		expect(mockPut).toHaveBeenCalledWith("/v1/card-privileges", request, {
			toastMessageWhenSuccess: true,
		});
	});

	test("getCardPrivileges should call list endpoint with params and return data list", async () => {
		const signal = new AbortController().signal;
		const query:GetCardPrivilegesQueryRequest = {
			code: "GOLD",
			accountType: "PERSONAL",
			cardType: "CREDIT",
		};

		const privileges = [
			{
				id: 1,
				privilegeCode: "GOLD",
				accountType: "PERSONAL",
				cardType: "CREDIT",
				annualFee: 200,
				cashbackRate: 1.5,
				expirationYears: 7,
				spendingLimitDaily: 5000,
				effectiveFrom: "2026-01-01",
				effectiveTo: "2030-01-01",
			},
		];

		mockGet.mockResolvedValue({ data: privileges });

		const result = await getCardPrivilegesByCodeAndAccountTypeAndCardTypeQuery(query, signal);

		expect(result).toEqual(privileges);
		expect(mockGet).toHaveBeenCalledWith("/v1/card-privileges", {
			signal,
			params: query,
		});
	});

	test("getCardPrivilegeById should call detail endpoint and return payload", async () => {
		const signal = new AbortController().signal;
		const dto = {
			id: 1,
			privilegeCode: "PLATINUM",
			accountType: "BUSINESS",
			cardType: "DEBIT",
			annualFee: 300,
			cashbackRate: 1,
			expirationYears: 10,
			spendingLimitDaily: 10000,
			effectiveFrom: "2026-01-01",
			effectiveTo: "2035-01-01",
		};

		mockGet.mockResolvedValue({ data: dto });

		const result = await getCardPrivilegeById(1, signal);

		expect(result).toEqual(dto);
		expect(mockGet).toHaveBeenCalledWith("/v1/card-privileges/1", { signal });
	});

	test("deleteCardPrivilege and deleteCardPrivilegeById should call delete endpoints", async () => {
		const deleteByQuery:DeleteCardPrivilegeRequest = {
			code: "GOLD",
			accountType: "PERSONAL",
			cardType: "CREDIT",
		};

		mockDelete.mockResolvedValueOnce({ data: "delete by query success" });
		mockDelete.mockResolvedValueOnce({ data: "delete by id success" });

		const resultByQuery = await deleteCardPrivilege(deleteByQuery);
		const resultById = await deleteCardPrivilegeById(1);

		expect(resultByQuery).toBe("delete by query success");
		expect(resultById).toBe("delete by id success");

		expect(mockDelete).toHaveBeenNthCalledWith(1, "/v1/card-privileges", {
			params: deleteByQuery,
			toastMessageWhenSuccess: true,
		});
		expect(mockDelete).toHaveBeenNthCalledWith(2, "/v1/card-privileges/1", {
			toastMessageWhenSuccess: true,
		});
	});
});
