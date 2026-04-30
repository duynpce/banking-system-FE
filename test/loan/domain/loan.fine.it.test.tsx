import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";
import {
  useCreateLoanFine,
  useGetLoanFineById,
  useGetLoanFinesWithPagination,
} from "../../../src/feat/loan/domain/useLoanFine";
import { LoanFineType } from "../../../src/feat/loan/domain/loan.fine.type";
import { ROOT_API_URL } from "../../../src/shared/constant/constant";
import { server } from "../../config/server.config";

// ──────────────────────────── MSW Handlers ────────────────────────────

server.use(
  http.post(`${ROOT_API_URL}/v1/loan-fines`, async ({ request }) => {
    const body = (await request.json()) as { loanId: number; amount: number; type: string; accountId: number; loanFinePolicyId: number };

    if (body.loanId === 1) {
      return new Response(
        JSON.stringify({ success: true, message: "create loan fine successfully", data: "ok" }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "loan not found" }),
      { status: 404 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loan-fines`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("paginationDto.page");

    if (page === "0") {
      return new Response(
        JSON.stringify({
          success: true,
          data: defaultLoanFineList,
          metaData: { totalItems: 1, totalPages: 1, currentPage: 0, pageSize: 10 },
        }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        metaData: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 },
      }),
      { status: 200 },
    );
  }),

  http.get(`${ROOT_API_URL}/v1/loan-fines/:id`, ({ params }) => {
    const id = Number(params.id);

    if (id === 1) {
      return new Response(
        JSON.stringify({ success: true, data: defaultLoanFineList[0] }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "loan fine not found" }),
      { status: 404 },
    );
  }),
);

// ──────────────────────────── Test data ────────────────────────────

const defaultLoanFineList = [
  {
    id: 1,
    loanId: 1,
    amount: 200,
    createdAt: "2026-01-15",
    type: LoanFineType.OVERDUE_PAYMENT,
  },
];

// ──────────────────────────── Test components ────────────────────────────

const CreateLoanFineForm = ({ loanId }: { loanId: number }) => {
  const createMutation = useCreateLoanFine();

  const handleSubmit = () => {
    createMutation.mutate({
      loanId,
      amount: 200,
      type: LoanFineType.OVERDUE_PAYMENT,
      accountId: 1,
      loanFinePolicyId: 1,
    });
  };

  return (
    <div>
      <button type="button" onClick={handleSubmit}>
        Add Fine
      </button>
    </div>
  );
};

const LoanFineListView = ({ page, limit }: { page: number; limit: number }) => {
  const { data, isLoading, isError } = useGetLoanFinesWithPagination({ page, limit });

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>fine-count:{data?.length ?? 0}</span>;
};

const LoanFineByIdView = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useGetLoanFineById(id);

  if (isLoading) return <span>Loading</span>;
  if (isError) return <span>Error</span>;

  return <span>fine-id:{data?.id ?? "none"}</span>;
};

// ──────────────────────────── Test suite ────────────────────────────

describe("loanFine integration", () => {
  const renderWithProvider = (ui: React.ReactNode) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  };

  it("useGetLoanFinesWithPagination should return fines when page is 0", async () => {
    renderWithProvider(<LoanFineListView page={0} limit={10} />);

    expect(await screen.findByText("fine-count:1")).toBeInTheDocument();
  });

  it("useGetLoanFinesWithPagination should return empty when page is not 0", async () => {
    renderWithProvider(<LoanFineListView page={1} limit={10} />);

    expect(await screen.findByText("fine-count:0")).toBeInTheDocument();
  });

  it("useGetLoanFineById should return fine when id is 1", async () => {
    renderWithProvider(<LoanFineByIdView id={1} />);

    expect(await screen.findByText("fine-id:1")).toBeInTheDocument();
  });

  it("useGetLoanFineById should show error when fine not found", async () => {
    renderWithProvider(<LoanFineByIdView id={999} />);

    expect(await screen.findByText("Error")).toBeInTheDocument();
  });

  it("useCreateLoanFine should show success toast when loanId is valid", async () => {
    const user = userEvent.setup();
    const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanFineForm loanId={1} />);

    await user.click(screen.getByRole("button", { name: "Add Fine" }));

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith("create loan fine successfully");
    });
  });

  it("useCreateLoanFine should show error toast when loan not found", async () => {
    const user = userEvent.setup();
    const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
    renderWithProvider(<CreateLoanFineForm loanId={999} />);

    await user.click(screen.getByRole("button", { name: "Add Fine" }));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith("loan not found");
    });
  });
});
