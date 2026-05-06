import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import {
  useCreateLoan,
  useGetLoanById,
  useGetLoanReport,
  useGetLoansWithPagination,
} from "../../../src/feat/loan/domain/useLoan";
import { LoanStatus, LoanType } from "../../../src/feat/loan/domain/loan.type";
import { ROOT_API_URL } from "../../../src/shared/constant/constant";
import { server } from "../../config/server.config";

// ──────────────────────────── MSW Handlers ────────────────────────────

server.use(
  http.post(`${ROOT_API_URL}/v1/loans`, async ({ request }) => {
    const body = (await request.json()) as { amount: number; type: string; policyId: number };

    if (body.policyId === 1) {
      return new Response(
        JSON.stringify({ success: true, message: "create loan successfully", data: "ok" }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "policy not found" }),
      { status: 404 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loans`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("paginationDto.page");
    const limit = url.searchParams.get("paginationDto.limit");

    if (page === null || limit === null) {
      return new Response(
        JSON.stringify({ success: false, message: "invalid params" }),
        { status: 400 },
      );
    }

    if (page === "0") {
      return new Response(
        JSON.stringify({
          success: true,
          data: defaultLoanList,
          metaData: { totalItems: 1, totalPages: 1, currentPage: 0, pageSize: 10 },
        }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        metaData: { totalItems: 0, totalPages: 0, currentPage: Number(page), pageSize: Number(limit) },
      }),
      { status: 200 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loans/reports`, ({ request }) => {
    const url = new URL(request.url);
    const loanStatus = url.searchParams.get("loanStatus");

    if (loanStatus === LoanStatus.CURRENT_PAYMENT || loanStatus === null) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            loanStatus: LoanStatus.CURRENT_PAYMENT,
            totalAmount: 50000,
            leftAmount: 40000,
            monthlyInstallment: 1200,
          },
        }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "invalid status" }),
      { status: 400 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loans/:id`, ({ params }) => {
    const id = Number(params.id);

    if (id === 1) {
      return new Response(
        JSON.stringify({ success: true, data: defaultLoanList[0] }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "loan not found" }),
      { status: 404 },
    );
  }),

);

// ──────────────────────────── Test data ────────────────────────────

const defaultLoanList = [
  {
    id: 1,
    totalAmount: 10000,
    leftAmount: 8000,
    dueDate: "2027-01-01",
    status: LoanStatus.CURRENT_PAYMENT,
    type: LoanType.CREDIT,
    createdAt: "2026-01-01",
    durationMonths: 12,
    interestRate: 5.5,
  },
];

// ──────────────────────────── Test components ────────────────────────────

const CreateLoanForm = ({ policyId }: { policyId: number }) => {
  const createMutation = useCreateLoan();

  const handleSubmit = () => {
    createMutation.mutate({ amount: 5000, type: LoanType.CREDIT, policyId });
  };

  return (
    <div>
      <button type="button" onClick={handleSubmit}>
        Apply Loan
      </button>
    </div>
  );
};

const LoanListView = ({ page, limit }: { page: number; limit: number }) => {
  const { data, isLoading, isError } = useGetLoansWithPagination(page, limit);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>loan-count:{data?.data.length ?? 0}</span>;
};

const LoanByIdView = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useGetLoanById(id);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>loan-id:{data?.id ?? "none"}</span>;
};

const LoanReportView = ({ loanStatus }: { loanStatus?: LoanStatus }) => {
  const { data, isLoading, isError } = useGetLoanReport(loanStatus);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>monthly-installment:{data?.monthlyInstallment ?? 0}</span>;
};

// ──────────────────────────── Test suite ────────────────────────────

describe("loan integration", () => {
  const renderWithProvider = (ui: React.ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it("useGetLoansWithPagination should return loans when page is 0", async () => {
    renderWithProvider(<LoanListView page={0} limit={10} />);

    expect(await screen.findByText("loan-count:1")).toBeInTheDocument();
  });

  it("useGetLoansWithPagination should return empty when page is not 0", async () => {
    renderWithProvider(<LoanListView page={1} limit={10} />);

    expect(await screen.findByText("loan-count:0")).toBeInTheDocument();
  });

  it("useGetLoanById should return loan when id is 1", async () => {
    renderWithProvider(<LoanByIdView id={1} />);

    expect(await screen.findByText("loan-id:1")).toBeInTheDocument();
  });

  it("useGetLoanById should show error when loan not found", async () => {
    renderWithProvider(<LoanByIdView id={999} />);

    expect(await screen.findByText("Error")).toBeInTheDocument();
  });

  it("useGetLoanReport should return report data for CURRENT_PAYMENT status", async () => {
    renderWithProvider(<LoanReportView loanStatus={LoanStatus.CURRENT_PAYMENT} />);

    expect(await screen.findByText("monthly-installment:1200")).toBeInTheDocument();
  });

  it("useGetLoanReport should show error when status is invalid", async () => {
    renderWithProvider(<LoanReportView loanStatus={LoanStatus.DONE_PAYMENT} />);

    expect(await screen.findByText("Error")).toBeInTheDocument();
  });

  it("useCreateLoan should show success toast when policyId is valid", async () => {
    const user = userEvent.setup();
    const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanForm policyId={1} />);

    await user.click(screen.getByRole("button", { name: "Apply Loan" }));

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("create loan successfully");
    });
  });

  it("useCreateLoan should show error toast when policyId is not found", async () => {
    const user = userEvent.setup();
    const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanForm policyId={999} />);

    await user.click(screen.getByRole("button", { name: "Apply Loan" }));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith("policy not found", { toastId: "generic-error" });
    });
  });
});
