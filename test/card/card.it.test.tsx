import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import type{ CreateCardRequest } from '../../src/feat/card/card.type';
import CreateCardSection from "../../src/feat/customer/dashboard/card/component/CreateCardSection";


let latestCreateCardRequest: CreateCardRequest | null = null;

server.use(
	http.get(`${ROOT_API_URL}/v1/accounts`, () => {
		return new Response(
			JSON.stringify({
				success: true,
				data: {
					id: 1,
					email: "personal@example.com",
					phoneNumber: "0123456789",
					address: "HCM",
					type: "PERSONAL",
					status: "ACTIVE",
				},
			}),
			{ status: 200 }
		);
	}),
	http.get(`${ROOT_API_URL}/v1/cards`, () => {
		return new Response(
			JSON.stringify({
				success: true,
				data: [],
				metaData: {
					totalItems: 0,
					totalPages: 1,
					currentPage: 0,
					pageSize: 4,
				},
			}),
			{ status: 200 }
		);
	}),

	http.get(`${ROOT_API_URL}/v1/card-privileges`, ({ request }) => {
		const url = new URL(request.url);
		const accountType = url.searchParams.get("accountType");
		const cardType = url.searchParams.get("cardType");

		if (accountType === "PERSONAL" && cardType === "CREDIT") {
			return new Response(
				JSON.stringify({
					success: true,
					data: [
						{
							id: 1,
							privilegeCode: "GOLD",
							expirationYears: 5,
							spendingLimitDaily: 1000,
							annualFee: 100,
							cashbackRate: 0.5,
							accountType: "PERSONAL",
							cardType: "CREDIT",
							effectiveFrom: "2025-01-01",
							effectiveTo: "2030-01-01",
						},
					],
				}),
				{ status: 200 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: [],
			}),
			{ status: 200 }
		);
	}),
			
	http.post(`${ROOT_API_URL}/v1/personal-cards`, async ({ request }) => {
		latestCreateCardRequest = (await request.json()) as CreateCardRequest;

		if (latestCreateCardRequest.pinCode === "123456") {
			return new Response(
				JSON.stringify({
					success: true,
					message: "card created successfully",
					data: "ok",
				}),
				{ status: 200 }
			);
		}

		return new Response(JSON.stringify({ success: false, message: "invalid pin" }), { status: 400 });
	})
);

describe("Card integration", () => {

	const renderPage =  () => {
		const queryClient = new QueryClient();
		return render(
			<QueryClientProvider client={queryClient}>
				<CreateCardSection />
			</QueryClientProvider>
		);
	};

	it("should submit create-card form and show success toast", async () => {
		const user = userEvent.setup();
		const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

		renderPage();

		await screen.findByPlaceholderText("Enter 6-digit pin code");
		await user.type(screen.getByPlaceholderText("Enter 6-digit pin code"), "123456");
		await user.click(screen.getByRole("button", { name: "Add Card" }));
		await screen.findByText("Please re-enter the pin code to confirm card creation.")
		await user.type(screen.getByPlaceholderText("Enter confirmation pin code"), "123456");
		await user.click(screen.getByRole("button", { name: "Confirm" }));
		await screen.findByText("Pin code confirmed. Click confirm to create the card.");
		await user.click(screen.getByRole("button", { name: "Confirm" }));

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith("card created successfully");
		});

    //temp assertion to verify request payload, can be removed after confirming the payload is correct
		expect(latestCreateCardRequest).not.toBeNull();
		expect(latestCreateCardRequest?.forAccountType).toBe("PERSONAL");
		expect(latestCreateCardRequest?.type).toBe("CREDIT");
		expect(latestCreateCardRequest?.pinCode).toBe("123456");
		expect(latestCreateCardRequest?.privilegeCode).toBe("GOLD");
	});

	it("should show error toast when empty pin code is submitted", async () => {
		const user = userEvent.setup();
		const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

		renderPage();

	 	await screen.findByPlaceholderText("Enter 6-digit pin code");
		await user.click(screen.getByRole("button", { name: "Add Card" }));
		await screen.findByText("Please re-enter the pin code to confirm card creation.")
		await user.click(screen.getByRole("button", { name: "Confirm" }));
		await screen.findByText("Pin code confirmed. Click confirm to create the card.");
		await user.click(screen.getByRole("button", { name: "Confirm" }));

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("PIN code: must be exactly 6 characters");
		});
	});
});

