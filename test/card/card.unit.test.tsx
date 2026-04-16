import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { AccountType } from "../../src/feat/account/account.type";
import { CardType, type CardDto, type CreateCardRequest } from "../../src/feat/card/card.type";
import { createCard, getCard, getCards } from "../../src/feat/card/card.service";

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

describe("card.service unit", () => {
	test("createCard should call personal-card endpoint and return response data", async () => {
		const request: CreateCardRequest 	= {
			forAccountType: AccountType.PERSONAL,
			privilegeCode: "GOLD",
			type: CardType.CREDIT,
			pinCode: "123456",
		};

		mockPost.mockResolvedValue({ message: "create personal card successfully" });

		const result = await createCard(request);

		expect(result.message).toBe("create personal card successfully");
		expect(mockPost).toHaveBeenCalledTimes(1);
		expect(mockPost).toHaveBeenCalledWith("/v1/personal-cards", request, {
			toastMessageWhenSuccess: true,
		});
	});

	test("createCard should throw when api.post fails", async () => {
		const request: CreateCardRequest = {
			forAccountType: AccountType.PERSONAL,
			privilegeCode: "GOLD",
			type: CardType.CREDIT,
			pinCode: "123456",
		};

		const error = new Error("network error");
		mockPost.mockRejectedValue(error);

		await expect(createCard(request)).rejects.toThrow("network error");
		expect(mockPost).toHaveBeenCalledTimes(1);
	});

	test("getCard should return the first card payload", async () => {
		const cardDto:CardDto = {
			id: "1",
			number: "123456******7890",
			type: CardType.CREDIT,
			expirationDate: "2030-01-01",
			privilege: "GOLD",
			holder: "John Doe",
			balance: 1000,
		};

		mockGet.mockResolvedValue({ data: cardDto });

		const result = await getCard();

		expect(result).toEqual(cardDto);
		expect(mockGet).toHaveBeenCalledTimes(1);
		expect(mockGet).toHaveBeenCalledWith("/v1/cards/first");
	});

	test("getCards should return paginated response object", async () => {
		const response = {
			success: true,
			data: [
				{
					id: "1",
					number: "123456******7890",
					type: CardType.DEBIT,
					expirationDate: "2030-01-01",
					privilege: "CLASSIC",
					holder: "John Doe",
					balance: 0,
				},
			],
			metaData: {
				totalItems: 1,
				totalPages: 1,
				currentPage: 0,
				pageSize: 4,
			},
		};

		mockGet.mockResolvedValue(response);

		const result = await getCards(0, 4);

		expect(result).toEqual(response);
		expect(mockGet).toHaveBeenCalledTimes(1);
		expect(mockGet).toHaveBeenCalledWith("/v1/cards", {
			params: { page: 0, limit: 4 },
		});
	});
});
