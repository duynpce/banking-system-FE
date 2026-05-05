import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import {
	useCreateTransaction,
	useGetTransactionsQueryByPeriod,
	useGetTransactionsWithPagination,
} from "../../src/feat/transaction/useTransaction";
import { TransactionType } from "../../src/feat/transaction/transaction.type";
import { ROOT_API_URL } from "../../src/shared/constant/constant";
import { server } from "../config/server.config";
import { CreateTransactionRequestSchema, type CreateTransactionRequest } from "../../src/feat/transaction/transaction.type";
import { toLocalDateString } from "../../src/feat/transaction/transaction.service";
import { useFormCustom } from "../../src/shared/hook/useFormCustom";

const validAccountNumber = "123456789012";

const todayLocalDate = toLocalDateString(new Date());

server.use(
	http.post(`${ROOT_API_URL}/v1/transactions`, async ({ request }) => {
		const requestBody = (await request.json()) as CreateTransactionRequest;
		const receiverAccountNumber = "receiverAccountNumber" in requestBody ? requestBody.receiverAccountNumber : undefined;

		if (receiverAccountNumber === validAccountNumber) {
			return new Response(
				JSON.stringify({
					success: true,
					message: "create transaction successfully",
					data: "ok",
				}),
				{ status: 200 }
			);
    }

		return new Response(JSON.stringify({ success: false, message: "create transaction failed, receiver account not found" }), {
			status: 404,
		});
	}),
	http.get(`${ROOT_API_URL}/v1/transactions`, ({ request }) => {
		const url = new URL(request.url);
		const transactionGroup = url.searchParams.get("transactionGroup");
		const endDate = url.searchParams.get("endDate");
		const page = url.searchParams.get("paginationDto.page");
		const limit = url.searchParams.get("paginationDto.limit");

		if (transactionGroup === null || page === null || limit === null) {
			return new Response(
				JSON.stringify({
					success: false,
					message: "invalid filter",
				}),
				{ status: 400 }
			);
		}

		if (endDate !== null) {
			if (endDate === todayLocalDate) {
				return new Response(
					JSON.stringify({
						success: true,
						data: defaultTransactionList,
						metaData: {
							totalItems: 1,
							totalPages: 1,
							currentPage: 0,
							pageSize: 100,
						},
					}),
					{ status: 200 }
				);
			}

			return new Response(
				JSON.stringify({
					success: true,
					data: [],
					metaData: {
						totalItems: 0,
						totalPages: 0,
						currentPage: 0,
						pageSize: 100,
					},
				}),
				{ status: 200 }
			);
    }

		if (page !== null) {
			if (page === "0") {
				return new Response(
					JSON.stringify({
						success: true,
						data: defaultTransactionList,
						metaData: {
							totalItems: 1,
							totalPages: 1,
							currentPage: 0,
							pageSize: 10,
						},
					}),
					{ status: 200 }
				);
			}

			return new Response(
				JSON.stringify({
					success: true,
					data: [],
					metaData: {
						totalItems: 0,
						totalPages: 0,
						currentPage: Number(page),
						pageSize: Number(limit),
					},
				}),
				{ status: 200 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: [],
				metaData: {
					totalItems: 0,
					totalPages: 0,
					currentPage: Number(page),
					pageSize: Number(limit),
				},
			}),
			{ status: 200 }
		);
	})
);

const defaultTransactionList = [
	{
		id: 1,
		senderAccountNumber: "000000000001",
		receiverAccountNumber: "000000000002",
		description: "salary payment",
		type: "TRANSFER",
		status: "COMPLETED",
		transferredAmount: 1200,
		createdAt: "2026-04-16T09:00:00.000Z",
		postedBalance: 5000,
	},
];

const TransactionsByPeriodView = () => {
	const { data, isLoading, isError } = useGetTransactionsQueryByPeriod("week", new Date());

	if (isLoading) {
		return <span>Loading</span>;
	}

	if (isError) {
		return <span>Error</span>;
	}

	return <span>transaction-count:{data?.length ?? 0}</span>;
};

const TransactionsByPeriodWithEndDateView = ({ endDate }: { endDate: Date }) => {
	const { data, isLoading, isError } = useGetTransactionsQueryByPeriod("week", endDate);

	if (isLoading) {
		return <span>Loading</span>;
	}

	if (isError) {
		return <span>Error</span>;
	}

	return <span>transaction-count:{data?.length ?? 0}</span>;
};

const TransactionsByPageView = ({ page, limit }: { page: number; limit: number }) => {
	const { data, isLoading, isError } = useGetTransactionsWithPagination(page, limit);

	if (isLoading) {
		return <span>Loading</span>;
	}

	if (isError) {
		return <span>Error</span>;
	}

	return <span>transaction-page-count:{data?.data?.length ?? 0}</span>;
};

const CreateTransactionForm = ({ accountNumber }: { accountNumber: string }) => {
	const createMutation = useCreateTransaction();
	const { register, handleSmartSubmit } = useFormCustom<CreateTransactionRequest>({
		defaultValues: {
			receiverAccountNumber: accountNumber,
			description: "monthly rent transfer",
			transferredAmount: 1500,
			type: TransactionType.TRANSFER,
		},
		resolver: zodResolver(CreateTransactionRequestSchema),
	});

	return (
		<form onSubmit={handleSmartSubmit((request) => createMutation.mutate(request))}>
			<input placeholder="receiver-account-number" {...register("receiverAccountNumber")} />
			<input placeholder="description" {...register("description")} />
			<input
				type="number"
				placeholder="transferred-amount"
				{...register("transferredAmount", { valueAsNumber: true })}
			/>
			<select aria-label="transaction-type" {...register("type")}>
				<option value="TRANSFER">TRANSFER</option>
				<option value="DEPOSIT">DEPOSIT</option>
				<option value="WITHDRAWAL">WITHDRAWAL</option>
				<option value="PAYMENT">PAYMENT</option>
				<option value="CASHBACK">CASHBACK</option>
			</select>
			<button type="submit">Create Transaction</button>
    </form>
	);
};

describe("transaction integration", () => {
	const renderWithProvider = (ui: React.ReactNode) => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});

		return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
	};

	const fillCreateTransactionForm = async (user: ReturnType<typeof userEvent.setup>, accountNumber: string) => {
		await user.clear(screen.getByPlaceholderText("receiver-account-number"));
		await user.type(screen.getByPlaceholderText("receiver-account-number"), accountNumber);

		await user.clear(screen.getByPlaceholderText("description"));
		await user.type(screen.getByPlaceholderText("description"), "monthly rent transfer");

		await user.clear(screen.getByPlaceholderText("transferred-amount"));
		await user.type(screen.getByPlaceholderText("transferred-amount"), "1500");
	};

	it("useGetTransactionsQueryByPeriod should return non-empty when endDate is today", async () => {
		renderWithProvider(<TransactionsByPeriodView />);

		expect(await screen.findByText("transaction-count:1")).toBeInTheDocument();
	});

	it("useGetTransactionsQueryByPeriod should return empty when endDate is not today", async () => {
		renderWithProvider(<TransactionsByPeriodWithEndDateView endDate={new Date("2020-01-01T00:00:00.000Z")} />);

		expect(await screen.findByText("transaction-count:0")).toBeInTheDocument();
	});

	it("useGetTransactionsWithPagination should return non-empty when page is 0", async () => {
		renderWithProvider(<TransactionsByPageView page={0} limit={10} />);

		expect(await screen.findByText("transaction-page-count:1")).toBeInTheDocument();
	});

	it("useGetTransactionsWithPagination should return empty when page is not 0", async () => {
		renderWithProvider(<TransactionsByPageView page={1} limit={10} />);

		expect(await screen.findByText("transaction-page-count:0")).toBeInTheDocument();
	});

	it("useCreateTransaction should submit and show success toast with valid account number", async () => {
		const user = userEvent.setup();
		const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
		renderWithProvider(<CreateTransactionForm accountNumber={validAccountNumber} />);

		await fillCreateTransactionForm(user, validAccountNumber);

		await user.click(screen.getByRole("button", { name: "Create Transaction" }));

		await waitFor(() => {
			expect(toastSuccessSpy).toHaveBeenCalledWith("create transaction successfully");
		});
	});

	it("useCreateTransaction should show error toast with random account number", async () => {
		const user = userEvent.setup();
		const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
		renderWithProvider(<CreateTransactionForm accountNumber="999999999999" />);

		await fillCreateTransactionForm(user, "999999999999");

		await user.click(screen.getByRole("button", { name: "Create Transaction" }));

		await waitFor(() => {
			expect(toastErrorSpy).toHaveBeenCalledWith("create transaction failed, receiver account not found");
		});
	});
});
