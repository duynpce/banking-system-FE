import { AxiosError } from 'axios';
import { describe, expect, test, vi, type Mock } from 'vitest';
import { handleCallback } from '../../../src/auth/callback/callback.service';
import { api } from '../../../src/utils/api';

vi.mock("../../../src/utils/api", () => ({
  api: {
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));
const mockGet = api.get as Mock;
const mockNavigate = vi.fn();

describe("test handleCallback", () => {
  test("success should navigate to home page", async () => {
    mockGet.mockResolvedValue({
      data: "mocked_token"
    });

    await handleCallback("valid_code", mockNavigate, new AbortController().signal);

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(api.defaults.headers.common["Authorization"]).toBe("Bearer mocked_token");
  });

  test("failure should navigate to login page", async () => {
    const mockError = new AxiosError();
    mockError.message = "unauthorized";
    mockGet.mockRejectedValue(mockError);

    await handleCallback("invalid_code", mockNavigate, new AbortController().signal);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});