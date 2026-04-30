import { AxiosError } from "axios";
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../../src/config/axios/api";
import {
  createLoan,
  getLoanById,
  getLoanReport,
  getLoansByFilter,
} from "../../../src/feat/loan/domain/loan.service";
import {
  LoanStatus,
  LoanType,
  type CreateLoanRequest,
} from "../../../src/feat/loan/domain/loan.type";

vi.mock("../../../src/config/axios/api", () => ({
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

// ──────────────────────────── Loans ────────────────────────────

describe("loan.service unit – Loans", () => {
  test("createLoan should call correct endpoint and return data", async () => {
    const request: CreateLoanRequest = {
      amount: 5000,
      type: LoanType.CREDIT,
      policyId: 1,
    };

    mockPost.mockResolvedValue({ data: "create loan successfully" });

    const result = await createLoan(request);

    expect(result).toBe("create loan successfully");
    expect(mockPost).toHaveBeenCalledWith("/v1/loans", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("createLoan should throw when api.post fails", async () => {
    const request: CreateLoanRequest = { amount: 5000, type: LoanType.CREDIT, policyId: 1 };
    mockPost.mockRejectedValue(new AxiosError("network error"));

    await expect(createLoan(request)).rejects.toThrow("network error");
  });

  test("getLoansByFilter should call correct endpoint with params", async () => {
    const signal = new AbortController().signal;
    const filter = {
      paginationDto: { page: 0, limit: 10 },
      status: LoanStatus.CURRENT_PAYMENT,
      loanType: LoanType.CREDIT,
      startDate: "2026-01-01",
      endDate: "2026-04-30",
    };

    const payload = [
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

    mockGet.mockResolvedValue({ data: payload, success: true });

    const result = await getLoansByFilter(filter, signal);

    expect(result).toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith("/v1/loans", {
      signal,
      params: {
        "paginationDto.page": 0,
        "paginationDto.limit": 10,
        status: LoanStatus.CURRENT_PAYMENT,
        loanType: LoanType.CREDIT,
        startDate: "2026-01-01",
        endDate: "2026-04-30",
      },
    });
  });

  test("getLoansByFilter should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("unauthorized"));

    await expect(
      getLoansByFilter({ paginationDto: { page: 0, limit: 10 } }),
    ).rejects.toThrow("unauthorized");
  });

  test("getLoanById should call correct endpoint", async () => {
    const signal = new AbortController().signal;
    const loanData = {
      id: 1,
      totalAmount: 10000,
      leftAmount: 8000,
      dueDate: "2027-01-01",
      status: LoanStatus.CURRENT_PAYMENT,
      type: LoanType.CREDIT,
      createdAt: "2026-01-01",
      durationMonths: 12,
      interestRate: 5.5,
    };

    mockGet.mockResolvedValue({ data: loanData, success: true });

    const result = await getLoanById(1, signal);

    expect(result).toEqual(loanData);
    expect(mockGet).toHaveBeenCalledWith("/v1/loans/1", { signal });
  });

  test("getLoanById should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("not found"));

    await expect(getLoanById(999)).rejects.toThrow("not found");
  });

  test("getLoanReport should call correct endpoint with optional status", async () => {
    const signal = new AbortController().signal;
    const reportData = {
      loanStatus: LoanStatus.CURRENT_PAYMENT,
      totalAmount: 50000,
      leftAmount: 40000,
      monthlyInstallment: 1200,
    };

    mockGet.mockResolvedValue({ data: reportData, success: true });

    const result = await getLoanReport(LoanStatus.CURRENT_PAYMENT, signal);

    expect(result).toEqual(reportData);
    expect(mockGet).toHaveBeenCalledWith("/v1/loans/reports", {
      signal,
      params: { loanStatus: LoanStatus.CURRENT_PAYMENT },
    });
  });

  test("getLoanReport should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("server error"));

    await expect(getLoanReport()).rejects.toThrow("server error");
  });
});
