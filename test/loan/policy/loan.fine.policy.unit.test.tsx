import { AxiosError } from "axios";
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../../src/config/axios/api";
import {
  createLoanFinePolicy,
  getLoanFinePolicyById,
  getLoanFinePolciesByPage,
  updateLoanFinePolicy,
} from "../../../src/feat/loan/policy/loan.fine.policy.service";
import { LoanFineType } from "../../../src/feat/loan/domain/loan.fine.type";
import type { CreateLoanFinePolicyRequest, UpdateLoanFinePolicyRequest } from "../../../src/feat/loan/policy/loan.fine.policy.type";

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

// ──────────────────────────── Loan Fine Policies ────────────────────────────

describe("loanFinePolicy.service unit – Loan Fine Policies", () => {
  test("createLoanFinePolicy should call correct endpoint", async () => {
    const request: CreateLoanFinePolicyRequest = {
      loanFineType: LoanFineType.OVERDUE_PAYMENT,
      amount: 500,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
    };

    mockPost.mockResolvedValue({ data: "create loan fine policy successfully" });

    const result = await createLoanFinePolicy(request);

    expect(result).toBe("create loan fine policy successfully");
    expect(mockPost).toHaveBeenCalledWith("/v1/loan-fine-policies", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("createLoanFinePolicy should throw when api.post fails", async () => {
    const request: CreateLoanFinePolicyRequest = {
      loanFineType: LoanFineType.OVERDUE_PAYMENT,
      amount: 500,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
    };

    mockPost.mockRejectedValue(new AxiosError("network error"));

    await expect(createLoanFinePolicy(request)).rejects.toThrow("network error");
  });

  test("updateLoanFinePolicy should call correct endpoint", async () => {
    const request: UpdateLoanFinePolicyRequest = { id: 1, amount: 600 };

    mockPut.mockResolvedValue({ data: "update loan fine policy successfully" });

    const result = await updateLoanFinePolicy(request);

    expect(result).toBe("update loan fine policy successfully");
    expect(mockPut).toHaveBeenCalledWith("/v1/loan-fine-policies", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("updateLoanFinePolicy should throw when api.put fails", async () => {
    mockPut.mockRejectedValue(new AxiosError("not found"));

    await expect(updateLoanFinePolicy({ id: 999 })).rejects.toThrow("not found");
  });

  test("getLoanFinePolciesByPage should call correct endpoint with params", async () => {
    const signal = new AbortController().signal;
    const paginationDto = { page: 0, limit: 10 };

    const payload = [
      {
        id: 1,
        type: LoanFineType.OVERDUE_PAYMENT,
        amount: 500,
        effectiveFrom: "2026-01-01",
        effectiveTo: "2027-01-01",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ];

    mockGet.mockResolvedValue({ data: payload, success: true });

    const result = await getLoanFinePolciesByPage(paginationDto, LoanFineType.OVERDUE_PAYMENT, signal);

    expect(result).toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith("/v1/loan-fine-policies", {
      signal,
      params: {
        "paginationDto.page": 0,
        "paginationDto.limit": 10,
        loanFineType: LoanFineType.OVERDUE_PAYMENT,
      },
    });
  });

  test("getLoanFinePolciesByPage should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("unauthorized"));

    await expect(getLoanFinePolciesByPage({ page: 0, limit: 10 }, LoanFineType.OVERDUE_PAYMENT)).rejects.toThrow("unauthorized");
  });

  test("getLoanFinePolicyById should call correct endpoint", async () => {
    const signal = new AbortController().signal;
    const policyData = {
      id: 1,
      type: LoanFineType.OVERDUE_PAYMENT,
      amount: 500,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
      createdAt: "2026-01-01T00:00:00Z",
    };

    mockGet.mockResolvedValue({ data: policyData, success: true });

    const result = await getLoanFinePolicyById(1, signal);

    expect(result).toEqual(policyData);
    expect(mockGet).toHaveBeenCalledWith("/v1/loan-fine-policies/1", { signal });
  });

  test("getLoanFinePolicyById should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("not found"));

    await expect(getLoanFinePolicyById(999)).rejects.toThrow("not found");
  });
});
