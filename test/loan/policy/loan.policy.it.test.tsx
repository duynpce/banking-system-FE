import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import {
  useCreateLoanPolicy,
  useGetLoanPoliciesWithPagination,
  useGetLoanPolicyById,
} from "../../../src/feat/loan/policy/useLoanPolicy";
import { LoanType } from "../../../src/feat/loan/domain/loan.type";
import { ROOT_API_URL } from "../../../src/shared/constant/constant";
import { server } from "../../config/server.config";

// ──────────────────────────── MSW Handlers ────────────────────────────

server.use(
  http.post(`${ROOT_API_URL}/v1/loan-policies`, async ({ request }) => {
    const body = (await request.json()) as { durationMonths: number; interestRate: number; loanType: string };

    if (body.loanType === LoanType.CREDIT) {
      return new Response(
        JSON.stringify({ success: true, message: "create loan policy successfully", data: "ok" }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "invalid loan type" }),
      { status: 400 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loan-policies`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("paginationDto.page");
    const loanType = url.searchParams.get("loanType");

    if (page === "0" && loanType === LoanType.CREDIT) {
      return new Response(
        JSON.stringify({
          success: true,
          data: defaultLoanPolicyList,
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

  http.get(`${ROOT_API_URL}/v1/loan-policies/:id`, ({ params }) => {
    const id = Number(params.id);

    if (id === 1) {
      return new Response(
        JSON.stringify({ success: true, data: defaultLoanPolicyList[0] }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "policy not found" }),
      { status: 404 },
    );
  }),
);

// ──────────────────────────── Test data ────────────────────────────

const defaultLoanPolicyList = [
  {
    id: 1,
    durationMonths: 12,
    interestRate: 5.5,
    loanType: LoanType.CREDIT,
    effectiveFrom: "2026-01-01",
    effectiveTo: "2027-01-01",
    createdAt: "2026-01-01T00:00:00Z",
    maxAmount: 100000,
  },
];

// ──────────────────────────── Test components ────────────────────────────

const CreateLoanPolicyForm = ({ loanType }: { loanType: LoanType }) => {
  const createMutation = useCreateLoanPolicy();

  const handleSubmit = () => {
    createMutation.mutate({
      durationMonths: 12,
      interestRate: 5.5,
      loanType,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
    });
  };

  return (
    <div>
      <button type="button" onClick={handleSubmit}>
        Add Policy
      </button>
    </div>
  );
};

const LoanPoliciesView = ({ page, limit, loanType }: { page: number; limit: number; loanType: LoanType }) => {
  const { data, isLoading, isError } = useGetLoanPoliciesWithPagination({ page, limit }, loanType);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>policy-count:{data?.length ?? 0}</span>;
};

const LoanPolicyByIdView = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useGetLoanPolicyById(id);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>policy-id:{data?.id ?? "none"}</span>;
};

// ──────────────────────────── Test suite ────────────────────────────

describe("loanPolicy integration", () => {
  const renderWithProvider = (ui: React.ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it("useGetLoanPoliciesWithPagination should return policies when page 0 and CREDIT type", async () => {
    renderWithProvider(<LoanPoliciesView page={0} limit={10} loanType={LoanType.CREDIT} />);

    expect(await screen.findByText("policy-count:1")).toBeInTheDocument();
  });

  it("useGetLoanPoliciesWithPagination should return empty for MORTGAGE type", async () => {
    renderWithProvider(<LoanPoliciesView page={0} limit={10} loanType={LoanType.MORTGAGE} />);

    expect(await screen.findByText("policy-count:0")).toBeInTheDocument();
  });

  it("useGetLoanPolicyById should return policy when id is 1", async () => {
    renderWithProvider(<LoanPolicyByIdView id={1} />);

    expect(await screen.findByText("policy-id:1")).toBeInTheDocument();
  });

  it("useGetLoanPolicyById should show error when policy not found", async () => {
    renderWithProvider(<LoanPolicyByIdView id={999} />);

    expect(await screen.findByText("Error")).toBeInTheDocument();
  });

  it("useCreateLoanPolicy should show success toast when loanType is CREDIT", async () => {
    const user = userEvent.setup();
    const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanPolicyForm loanType={LoanType.CREDIT} />);

    await user.click(screen.getByRole("button", { name: "Add Policy" }));

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("create loan policy successfully");
    });
  });

  it("useCreateLoanPolicy should show error toast when loanType is invalid", async () => {
    const user = userEvent.setup();
    const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanPolicyForm loanType={LoanType.MORTGAGE} />);

    await user.click(screen.getByRole("button", { name: "Add Policy" }));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith("invalid loan type");
    });
  });
});
