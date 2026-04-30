import { AxiosError } from "axios";
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../../src/config/axios/api";
import {
  createLoanFine,
  getLoanFineById,
  getLoanFinesByPage,
  updateLoanFine,
} from "../../../src/feat/loan/domain/loan.fine.service";
import {
  LoanFineType,
  type CreateLoanFineRequest,
  type UpdateLoanFineRequest,
} from "../../../src/feat/loan/domain/loan.fine.type";

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
const mockPut = api.put as Mock;

// ──────────────────────────── Loan Fines ────────────────────────────

describe("loanFine.service unit – Loan Fines", () => {
  test("createLoanFine should call correct endpoint", async () => {
    const request: CreateLoanFineRequest = {
      loanId: 1,
      amount: 200,
      type: LoanFineType.OVERDUE_PAYMENT,
      accountId: 1,
      loanFinePolicyId: 1,
    };

    mockPost.mockResolvedValue({ data: "create loan fine successfully" });

    const result = await createLoanFine(request);

    expect(result).toBe("create loan fine successfully");
    expect(mockPost).toHaveBeenCalledWith("/v1/loan-fines", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("createLoanFine should throw when api.post fails", async () => {
    const request: CreateLoanFineRequest = {
      loanId: 1,
      amount: 200,
      type: LoanFineType.OVERDUE_PAYMENT,
      accountId: 1,
      loanFinePolicyId: 1,
    };

    mockPost.mockRejectedValue(new AxiosError("network error"));

    await expect(createLoanFine(request)).rejects.toThrow("network error");
  });

  test("updateLoanFine should call correct endpoint", async () => {
    const request: UpdateLoanFineRequest = { id: 1, amount: 300 };

    mockPut.mockResolvedValue({ data: "update loan fine successfully" });

    const result = await updateLoanFine(request);

    expect(result).toBe("update loan fine successfully");
    expect(mockPut).toHaveBeenCalledWith("/v1/loan-fines", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("updateLoanFine should throw when api.put fails", async () => {
    mockPut.mockRejectedValue(new AxiosError("not found"));

    await expect(updateLoanFine({ id: 999 })).rejects.toThrow("not found");
  });

  test("getLoanFinesByPage should call correct endpoint", async () => {
    const signal = new AbortController().signal;
    const paginationDto = { page: 0, limit: 10 };

    const payload = [
      {
        id: 1,
        loanId: 1,
        amount: 200,
        createdAt: "2026-01-15",
        type: LoanFineType.OVERDUE_PAYMENT,
      },
    ];

    mockGet.mockResolvedValue({ data: payload, success: true });

    const result = await getLoanFinesByPage(paginationDto, signal);

    expect(result).toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith("/v1/loan-fines", {
      signal,
      params: { "paginationDto.page": 0, "paginationDto.limit": 10 },
    });
  });

  test("getLoanFinesByPage should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("unauthorized"));

    await expect(getLoanFinesByPage({ page: 0, limit: 10 })).rejects.toThrow("unauthorized");
  });

  test("getLoanFineById should call correct endpoint", async () => {
    const signal = new AbortController().signal;
    const fineData = {
      id: 1,
      loanId: 1,
      amount: 200,
      createdAt: "2026-01-15",
      type: LoanFineType.OVERDUE_PAYMENT,
    };

    mockGet.mockResolvedValue({ data: fineData, success: true });

    const result = await getLoanFineById(1, signal);

    expect(result).toEqual(fineData);
    expect(mockGet).toHaveBeenCalledWith("/v1/loan-fines/1", { signal });
  });

  test("getLoanFineById should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("not found"));

    await expect(getLoanFineById(999)).rejects.toThrow("not found");
  });
});
