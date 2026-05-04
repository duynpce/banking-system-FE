import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import {
  useCreateLoanFinePolicy,
  useGetLoanFinePolciesWithPagination,
  useGetLoanFinePolicyById,
} from "../../../src/feat/loan/policy/useLoanFinePolicy";
import { LoanFineType } from "../../../src/feat/loan/domain/loan.fine.type";
import { ROOT_API_URL } from "../../../src/shared/constant/constant";
import { server } from "../../config/server.config";

// ──────────────────────────── MSW Handlers ────────────────────────────

server.use(
  http.post(`${ROOT_API_URL}/v1/loan-fine-policies`, async ({ request }) => {
    const body = (await request.json()) as { loanFineType: string; amount: number };

    if (body.loanFineType === LoanFineType.OVERDUE_PAYMENT) {
      return new Response(
        JSON.stringify({ success: true, message: "create loan fine policy successfully", data: "ok" }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "invalid fine type" }),
      { status: 400 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loan-fine-policies`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("paginationDto.page");
    const loanFineType = url.searchParams.get("loanFineType");

    if (page === "0" && loanFineType === LoanFineType.OVERDUE_PAYMENT) {
      return new Response(
        JSON.stringify({
          success: true,
          data: defaultLoanFinePolicyList,
          metaData: { totalItems: 1, totalPages: 1, currentPage: 0, pageSize: 10 },
        }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        metaData: { totalItems: 0, totalPages: 0, currentPage: 0, pageSize: 10 },
      }),
      { status: 200 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loan-fine-policies/:id`, ({ params }) => {
    const id = Number(params.id);

    if (id === 1) {
      return new Response(
        JSON.stringify({ success: true, data: defaultLoanFinePolicyList[0] }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "fine policy not found" }),
      { status: 404 },
    );
  }),
);

// ──────────────────────────── Test data ────────────────────────────

const defaultLoanFinePolicyList = [
  {
    id: 1,
    type: LoanFineType.OVERDUE_PAYMENT,
    amount: 500,
    effectiveFrom: "2026-01-01",
    effectiveTo: "2027-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// ──────────────────────────── Test components ────────────────────────────

const CreateLoanFinePolicyForm = ({ loanFineType }: { loanFineType: LoanFineType }) => {
  const createMutation = useCreateLoanFinePolicy();

  const handleSubmit = () => {
    createMutation.mutate({
      loanFineType,
      amount: 500,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
    });
  };

  return (
    <div>
      <button type="button" onClick={handleSubmit}>
        Add Fine Policy
      </button>
    </div>
  );
};

const LoanFinePolciesView = ({ page, limit, loanFineType }: { page: number; limit: number; loanFineType: LoanFineType }) => {
  const { data, isLoading, isError } = useGetLoanFinePolciesWithPagination({ page, limit }, loanFineType);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>fine-policy-count:{data?.length ?? 0}</span>;
};

const LoanFinePolicyByIdView = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useGetLoanFinePolicyById(id);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>fine-policy-id:{data?.id ?? "none"}</span>;
};

// ──────────────────────────── Test suite ────────────────────────────

describe("loanFinePolicy integration", () => {
  const renderWithProvider = (ui: React.ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it("useGetLoanFinePolciesWithPagination should return policies when page 0 and OVERDUE type", async () => {
    renderWithProvider(<LoanFinePolciesView page={0} limit={10} loanFineType={LoanFineType.OVERDUE_PAYMENT} />);

    expect(await screen.findByText("fine-policy-count:1")).toBeInTheDocument();
  });

  it("useGetLoanFinePolciesWithPagination should return empty for EARLY_PAYMENT type", async () => {
    renderWithProvider(<LoanFinePolciesView page={0} limit={10} loanFineType={LoanFineType.EARLY_PAYMENT} />);

    expect(await screen.findByText("fine-policy-count:0")).toBeInTheDocument();
  });

  it("useGetLoanFinePolicyById should return policy when id is 1", async () => {
    renderWithProvider(<LoanFinePolicyByIdView id={1} />);

    expect(await screen.findByText("fine-policy-id:1")).toBeInTheDocument();
  });

  it("useGetLoanFinePolicyById should show error when policy not found", async () => {
    renderWithProvider(<LoanFinePolicyByIdView id={999} />);

    expect(await screen.findByText("Error")).toBeInTheDocument();
  });

  it("useCreateLoanFinePolicy should show success toast when fine type is OVERDUE_PAYMENT", async () => {
    const user = userEvent.setup();
    const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanFinePolicyForm loanFineType={LoanFineType.OVERDUE_PAYMENT} />);

    await user.click(screen.getByRole("button", { name: "Add Fine Policy" }));

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("create loan fine policy successfully");
    });
  });

  it("useCreateLoanFinePolicy should show error toast when fine type is invalid", async () => {
    const user = userEvent.setup();
    const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanFinePolicyForm loanFineType={LoanFineType.EARLY_PAYMENT} />);

    await user.click(screen.getByRole("button", { name: "Add Fine Policy" }));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith("invalid fine type");
    });
  });
});
