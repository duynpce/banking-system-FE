import { describe, expect, it, vi } from "vitest";
import { http } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { server } from "../config/server.config";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import CustomerDashboardCard from "../../src/feat/customer/dashboard/card/CustomerDashboardCard";

type CreateCardRequestBody = {
	forAccountType: "PERSONAL" | "BUSINESS" | "GOVERNMENT";
	privilegeCode: string;
	type: "CREDIT" | "DEBIT";
	pinCode: string;
	holder?: string;
};

let latestCreateCardRequest: CreateCardRequestBody | null = null;

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
	http.post(`${ROOT_API_URL}/v1/personal-cards`, async ({ request }) => {
		latestCreateCardRequest = (await request.json()) as CreateCardRequestBody;

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

	const renderPage = () => {
		const queryClient = new QueryClient();
		return render(
			<QueryClientProvider client={queryClient}>
				<CustomerDashboardCard />
			</QueryClientProvider>
		);
	};

	it("should submit create-card form and show success toast", async () => {
		const user = userEvent.setup();
		const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

		renderPage();

		await user.type(screen.getByPlaceholderText("Enter 6-digit pin code"), "123456");
		await user.click(screen.getByRole("button", { name: "Add Card" }));

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith("card created successfully");
		});

    //temp assertion to verify request payload, can be removed after confirming the payload is correct
		expect(latestCreateCardRequest).not.toBeNull();
		expect(latestCreateCardRequest?.forAccountType).toBe("PERSONAL");
		expect(latestCreateCardRequest?.type).toBe("CREDIT");
		expect(latestCreateCardRequest?.pinCode).toBe("123456");
		expect(latestCreateCardRequest?.privilegeCode).toBe("CLASSIC");
	});

	it("should show error toast when backend returns failure", async () => {
		const user = userEvent.setup();
		const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

		renderPage();

		await user.type(screen.getByPlaceholderText("Enter 6-digit pin code"), "654321");
		await user.click(screen.getByRole("button", { name: "Add Card" }));

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("invalid pin");
		});
	});
});
