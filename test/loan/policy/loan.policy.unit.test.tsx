import { AxiosError } from "axios";
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../../src/config/axios/api";
import {
  createLoanPolicy,
  getLoanPoliciesByPage,
  getLoanPolicyById,
  updateLoanPolicy,
} from "../../../src/feat/loan/policy/loan.policy.service";
import { LoanType } from "../../../src/feat/loan/domain/loan.type";
import type { CreateLoanPolicyRequest, UpdateLoanPolicyRequest } from "../../../src/feat/loan/policy/loan.policy.type";

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

// ──────────────────────────── Loan Policies ────────────────────────────

describe("loanPolicy.service unit – Loan Policies", () => {
  test("createLoanPolicy should call correct endpoint", async () => {
    const request: CreateLoanPolicyRequest = {
      durationMonths: 12,
      interestRate: 5.5,
      loanType: LoanType.CREDIT,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
    };

    mockPost.mockResolvedValue({ data: "create loan policy successfully" });

    const result = await createLoanPolicy(request);

    expect(result).toBe("create loan policy successfully");
    expect(mockPost).toHaveBeenCalledWith("/v1/loan-policies", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("createLoanPolicy should throw when api.post fails", async () => {
    const request: CreateLoanPolicyRequest = {
      durationMonths: 12,
      interestRate: 5.5,
      loanType: LoanType.CREDIT,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
    };

    mockPost.mockRejectedValue(new AxiosError("network error"));

    await expect(createLoanPolicy(request)).rejects.toThrow("network error");
  });

  test("updateLoanPolicy should call correct endpoint", async () => {
    const request: UpdateLoanPolicyRequest = { id: 1, interestRate: 6.0 };

    mockPut.mockResolvedValue({ data: "update loan policy successfully" });

    const result = await updateLoanPolicy(request);

    expect(result).toBe("update loan policy successfully");
    expect(mockPut).toHaveBeenCalledWith("/v1/loan-policies", request, {
      toastMessageWhenSuccess: true,
    });
  });

  test("updateLoanPolicy should throw when api.put fails", async () => {
    mockPut.mockRejectedValue(new AxiosError("not found"));

    await expect(updateLoanPolicy({ id: 999 })).rejects.toThrow("not found");
  });

  test("getLoanPoliciesByPage should call correct endpoint with params", async () => {
    const signal = new AbortController().signal;
    const paginationDto = { page: 0, limit: 10 };

    const payload = [
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

    mockGet.mockResolvedValue({ data: payload, success: true });

    const result = await getLoanPoliciesByPage(paginationDto, LoanType.CREDIT, signal);

    expect(result).toEqual(payload);
    expect(mockGet).toHaveBeenCalledWith("/v1/loan-policies", {
      signal,
      params: {
        "paginationDto.page": 0,
        "paginationDto.limit": 10,
        loanType: LoanType.CREDIT,
      },
    });
  });

  test("getLoanPoliciesByPage should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("unauthorized"));

    await expect(getLoanPoliciesByPage({ page: 0, limit: 10 }, LoanType.CREDIT)).rejects.toThrow("unauthorized");
  });

  test("getLoanPolicyById should call correct endpoint", async () => {
    const signal = new AbortController().signal;
    const policyData = {
      id: 1,
      durationMonths: 12,
      interestRate: 5.5,
      loanType: LoanType.CREDIT,
      effectiveFrom: "2026-01-01",
      effectiveTo: "2027-01-01",
      createdAt: "2026-01-01T00:00:00Z",
      maxAmount: 100000,
    };

    mockGet.mockResolvedValue({ data: policyData, success: true });

    const result = await getLoanPolicyById(1, signal);

    expect(result).toEqual(policyData);
    expect(mockGet).toHaveBeenCalledWith("/v1/loan-policies/1", { signal });
  });

  test("getLoanPolicyById should throw when api.get fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("not found"));

    await expect(getLoanPolicyById(999)).rejects.toThrow("not found");
  });
});
