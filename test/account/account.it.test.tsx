import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { server } from "../config/server.config";
import { useGetAccountQuery, useUpdateAccount } from "../../src/feat/account/useAccount";
import {
	AccountType,
	type UpdateAccountRequest,
	updateAccountRequestSchema,
} from "../../src/feat/account/account.type";
import { useFormCustom } from "../../src/shared/hook/useFormCustom";


let latestUpdateAccountRequest: UpdateAccountRequest | null = null;

	server.use(
		http.get(`${ROOT_API_URL}/v1/accounts`, () => {
			return new Response(
				JSON.stringify({
					success: true,
					data: {
						id: 1,
						email: "profile_success@example.com",
						phoneNumber: "0123456789",
						address: "HCM city",
						type: "BUSINESS",
						status: "ACTIVE",
					},
				}),
				{ status: 200 }
			);
		}),
		http.put(`${ROOT_API_URL}/v1/business-accounts`, async ({ request }) => {
			latestUpdateAccountRequest = (await request.json()) as UpdateAccountRequest;

			if (latestUpdateAccountRequest.email.includes("success")) {
				return new Response(
					JSON.stringify({
						success: true,
						message: "update account successfully",
						data: "ok",
					}),
					{ status: 200 }
				);
			}

			return new Response(JSON.stringify({ success: false, message: "update account failed" }), {
				status: 400,
			});
		})
	);

const GetAccountView = () => {
	const { data, isLoading } = useGetAccountQuery();

	if (isLoading) {
		return <span>Loading</span>;
	}

	return (
		<div>
			<span>email:{data?.email ?? ""}</span>
			<span>type:{data?.type ?? ""}</span>
		</div>
	);
};

const UpdateAccountForm = () => {
	const updateMutation = useUpdateAccount();

	const { register, handleSmartSubmit } = useFormCustom<UpdateAccountRequest>({
		defaultValues: {
			type: AccountType.BUSINESS,
			email: "",
			phoneNumber: "",
			address: "",
			organizationName: "",
			taxIdNumber: "",
		},
		resolver: zodResolver(updateAccountRequestSchema),
	});

	return (
		<form
			onSubmit={handleSmartSubmit((request) =>
				updateMutation.mutate({ updateAccountRequest: request })
			)}
		>
			<select aria-label="account-type" {...register("type")}>
				<option value="BUSINESS">BUSINESS</option>
			</select>
			<input placeholder="email" {...register("email")} />
			<input placeholder="phoneNumber" {...register("phoneNumber")} />
			<input placeholder="address" {...register("address")} />
			<input placeholder="organizationName" {...register("organizationName")} />
			<input placeholder="taxIdNumber" {...register("taxIdNumber")} />
			<button type="submit">Update Account</button>
		</form>
	);
};

describe("account integration", () => {

	const renderWithProvider = (ui: React.ReactNode) => {
		const queryClient = new QueryClient();

		return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
	};

	const fillUpdateBusinessForm = async (user: ReturnType<typeof userEvent.setup>, email: string) => {
		await user.type(screen.getByPlaceholderText("email"), email);
		await user.type(screen.getByPlaceholderText("phoneNumber"), "0123456789");
		await user.type(screen.getByPlaceholderText("address"), "HCM city");
		await user.type(screen.getByPlaceholderText("organizationName"), "Acme Corp");
		await user.type(screen.getByPlaceholderText("taxIdNumber"), "1234567890");
	};

	it("getAccount should render fetched account data", async () => {
		renderWithProvider(<GetAccountView />);

		expect(await screen.findByText("email:profile_success@example.com")).toBeInTheDocument();
		expect(await screen.findByText("type:BUSINESS")).toBeInTheDocument();
	});

	it("getAccount should show error toast when backend returns failure", async () => {
		const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

		server.use(
			http.get(`${ROOT_API_URL}/v1/accounts`, () => {
				return new Response(JSON.stringify({ success: false, message: "get account failed" }), {
					status: 400,
				});
			})
		);

		renderWithProvider(<GetAccountView />);

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("get account failed", { toastId: "generic-error" });
		});
	});

	it("updateAccount should submit form and show success toast", async () => {
		const user = userEvent.setup();
		const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

		renderWithProvider(<UpdateAccountForm />);

		await fillUpdateBusinessForm(user, "business_success@example.com");
		await user.click(screen.getByRole("button", { name: "Update Account" }));

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith("update account successfully");
		});

		expect(latestUpdateAccountRequest).not.toBeNull();
		expect(latestUpdateAccountRequest?.type).toBe("BUSINESS");
		expect(latestUpdateAccountRequest?.email).toBe("business_success@example.com");
	});

	it("updateAccount should show error toast when backend returns failure", async () => {
		const user = userEvent.setup();
		const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

		renderWithProvider(<UpdateAccountForm />);

		await fillUpdateBusinessForm(user, "business_failed@example.com");
		await user.click(screen.getByRole("button", { name: "Update Account" }));

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("update account failed", { toastId: "generic-error" });
		});
	});
});
