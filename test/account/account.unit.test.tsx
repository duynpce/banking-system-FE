import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { AccountType, type AccountDto, type CreateAccountRequest, type UpdateAccountRequest } from "../../src/feat/account/account.type";
import {
	createAccount,
	getAccount,
	updateAccount,
} from "../../src/feat/account/account.service";
import { AxiosError } from "axios";

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

describe("account.service unit", () => {
	test("createAccount should call personal-account endpoint correctly", async () => {
		const request:CreateAccountRequest = {
			type: AccountType.PERSONAL,
			username: "john_doe",
			password: "Pass@123",
			email: "john@example.com",
			phoneNumber: "0123456789",
			address: "HCM city",
			fullName: "John Doe",
			idCardNumber: "123456789",
			dateOfBirth: "2000-01-01",
					gender: "MALE",
				};

		mockPost.mockResolvedValue({ data: "create personal account successfully" });

		const result = await createAccount(request);

		expect(result).toEqual({ data: "create personal account successfully" });
		expect(mockPost).toHaveBeenCalledWith("/v1/personal-accounts", request, {
			toastMessageWhenSuccess: true,
		});
	});

	test("createAccount should throw when api.post fails", async () => {
		const request: CreateAccountRequest = {
			type: AccountType.PERSONAL,
			username: "john_doe",
			password: "Pass@123",
			email: "john@example.com",
			phoneNumber: "0123456789",
			address: "HCM city",
			fullName: "John Doe",
			idCardNumber: "123456789",
			dateOfBirth: "2000-01-01",
			gender: "MALE",
		};

		const error = new AxiosError("network error");
		mockPost.mockRejectedValue(error);

		await expect(createAccount(request as never)).rejects.toThrow("network error");
	});

	test("updateAccount should call business-account endpoint correctly", async () => {
		const request: UpdateAccountRequest = {
			type: AccountType.BUSINESS,
			email: "biz@example.com",
			phoneNumber: "0123456789",
			address: "HCM city",
			organizationName: "Acme Corp",
			taxIdNumber: "1234567890",
		};

		mockPut.mockResolvedValue({ data: "update business account successfully" });

		const result = await updateAccount(request as never);

		expect(result).toEqual({ data: "update business account successfully" });
		expect(mockPut).toHaveBeenCalledWith("/v1/business-accounts", request, {
			toastMessageWhenSuccess: true,
		});
	});

	test("updateAccount should throw when api.put fails", async () => {
		const request: UpdateAccountRequest = {
			type: AccountType.BUSINESS,
			email: "biz@example.com",
			phoneNumber: "0123456789",
			address: "HCM city",
			organizationName: "Acme Corp",
			taxIdNumber: "1234567890",
		};

		const error = new AxiosError("unauthorized");
		mockPut.mockRejectedValue(error);

		await expect(updateAccount(request as never)).rejects.toThrow("unauthorized");
	});

	test("getAccount should return account payload", async () => {
		const signal = new AbortController().signal;
		const account:AccountDto = {
			id: 1,
			email: "john@example.com",
			balance: 1000,
			phoneNumber: "0123456789",
			number: "123456789012",
			address: "HCM city",
			type: AccountType.PERSONAL,
			status: "ACTIVE",
		};

		mockGet.mockResolvedValue({ data: account });

		const result = await getAccount(signal);

		expect(result).toEqual(account);
		expect(mockGet).toHaveBeenCalledWith("/v1/accounts", { signal });
	});

	test("getAccount should throw when api.get fails", async () => {
		const error = new AxiosError("unauthorized");
		mockGet.mockRejectedValue(error);

		await expect(getAccount()).rejects.toThrow("unauthorized");
	});

});
