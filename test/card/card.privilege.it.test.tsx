import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import {
	CreateCardPrivilegeRequestSchema,
	type CreateCardPrivilegeRequest,
} from "../../src/feat/card/card.privilege.type";
import { useCreateCardPrivilege } from "../../src/feat/card/useCardPrivilege";
import { useFormCustom } from "../../src/shared/hook/useFormCustom";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { server } from "../config/server.config";

type CreateCardPrivilegeRequestBody = {
	code: string;
	expirationYears: number;
	spendingLimitDaily: number;
	annualFee: number;
	cashbackRate: number;
	accountType: "PERSONAL" | "BUSINESS" | "GOVERNMENT";
	cardType: "CREDIT" | "DEBIT";
	effectiveFrom: string;
	effectiveTo: string;
};

let latestCreatePrivilegeRequest: CreateCardPrivilegeRequestBody | null = null;

server.use(
	http.post(`${ROOT_API_URL}/v1/card-privileges`, async ({ request }) => {
		latestCreatePrivilegeRequest = (await request.json()) as CreateCardPrivilegeRequestBody;

		if (latestCreatePrivilegeRequest.code === "GOLD") {
			return new Response(
				JSON.stringify({
					success: true,
					message: "create card privilege successfully",
					data: "ok",
				}),
				{ status: 200 }
			);
		}

		return new Response(JSON.stringify({ success: false, message: "create card privilege failed" }), {
			status: 400,
		});
	})
);

const CardPrivilegeForm = () => {
	const createCardPrivilegeMutation = useCreateCardPrivilege();

	const { register, handleSmartSubmit } = useFormCustom<CreateCardPrivilegeRequest>({
		defaultValues: {
			code: "",
			expirationYears: 1,
			spendingLimitDaily: 0,
			annualFee: 0,
			cashbackRate: 0,
			accountType: "PERSONAL",
			cardType: "CREDIT",
			effectiveFrom: "2026-01-01",
			effectiveTo: "2028-01-01",
		},
		resolver: zodResolver(CreateCardPrivilegeRequestSchema),
	});

	return (
		<form onSubmit={handleSmartSubmit((request) => createCardPrivilegeMutation.mutate(request))}>
			<input placeholder="code" {...register("code")} />
			<input placeholder="expirationYears" type="number" {...register("expirationYears", { valueAsNumber: true })} />
			<input placeholder="spendingLimitDaily" type="number" {...register("spendingLimitDaily", { valueAsNumber: true })} />
			<input placeholder="annualFee" type="number" {...register("annualFee", { valueAsNumber: true })} />
			<input placeholder="cashbackRate" type="number" step="0.1" {...register("cashbackRate", { valueAsNumber: true })} />

			<select aria-label="account-type" {...register("accountType")}>
				<option value="PERSONAL">PERSONAL</option>
				<option value="BUSINESS">BUSINESS</option>
				<option value="GOVERNMENT">GOVERNMENT</option>
			</select>

			<select aria-label="card-type" {...register("cardType")}>
				<option value="CREDIT">CREDIT</option>
				<option value="DEBIT">DEBIT</option>
			</select>

			<input placeholder="effectiveFrom" type="date" {...register("effectiveFrom")} />
			<input placeholder="effectiveTo" type="date" {...register("effectiveTo")} />

			<button type="submit">Create Privilege</button>
		</form>
	);
};

describe("Card privilege integration", () => {
	const renderPage = () => {
		const queryClient = new QueryClient();
		return render(
			<QueryClientProvider client={queryClient}>
				<CardPrivilegeForm />
			</QueryClientProvider>
		);
	};

	it("should submit privilege form and show success toast", async () => {
		const user = userEvent.setup();
		const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");

		renderPage();

		await user.type(screen.getByPlaceholderText("code"), "gold");
		await user.clear(screen.getByPlaceholderText("expirationYears"));
		await user.type(screen.getByPlaceholderText("expirationYears"), "7");
		await user.clear(screen.getByPlaceholderText("spendingLimitDaily"));
		await user.type(screen.getByPlaceholderText("spendingLimitDaily"), "5000");
		await user.clear(screen.getByPlaceholderText("annualFee"));
		await user.type(screen.getByPlaceholderText("annualFee"), "200");
		await user.clear(screen.getByPlaceholderText("cashbackRate"));
		await user.type(screen.getByPlaceholderText("cashbackRate"), "1.5");
		await user.selectOptions(screen.getByLabelText("account-type"), "PERSONAL");
		await user.selectOptions(screen.getByLabelText("card-type"), "CREDIT");

		await user.click(screen.getByRole("button", { name: "Create Privilege" }));

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith("create card privilege successfully");
		});

		expect(latestCreatePrivilegeRequest).not.toBeNull();
		expect(latestCreatePrivilegeRequest?.code).toBe("GOLD");
		expect(latestCreatePrivilegeRequest?.accountType).toBe("PERSONAL");
		expect(latestCreatePrivilegeRequest?.cardType).toBe("CREDIT");
		expect(latestCreatePrivilegeRequest?.expirationYears).toBe(7);
		expect(latestCreatePrivilegeRequest?.spendingLimitDaily).toBe(5000);
	});

	it("should show error toast when backend returns failure", async () => {
		const user = userEvent.setup();
		const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");

		renderPage();

		await user.type(screen.getByPlaceholderText("code"), "silver");
		await user.clear(screen.getByPlaceholderText("expirationYears"));
		await user.type(screen.getByPlaceholderText("expirationYears"), "5");
		await user.clear(screen.getByPlaceholderText("spendingLimitDaily"));
		await user.type(screen.getByPlaceholderText("spendingLimitDaily"), "1000");
		await user.clear(screen.getByPlaceholderText("annualFee"));
		await user.type(screen.getByPlaceholderText("annualFee"), "100");
		await user.clear(screen.getByPlaceholderText("cashbackRate"));
		await user.type(screen.getByPlaceholderText("cashbackRate"), "1");

		await user.click(screen.getByRole("button", { name: "Create Privilege" }));

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("create card privilege failed", { toastId: "generic-error" });
		});
	});
});
