import { AxiosError } from 'axios';
import { describe, expect, test, vi, type Mock } from 'vitest';
import { handleCallback } from '../../../src/feat/auth/callback/callback.service';
import { api, setAccessToken } from '../../../src/config/axios/api';

vi.mock("../../../src/config/api", () => ({
  api: {
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
  setAccessToken: vi.fn(),
}));
const mockGet = api.get as Mock;
const mockSetAccessToken = setAccessToken as Mock;
const mockNavigate = vi.fn();

describe("test handleCallback", () => {
  test("success should navigate to home page", async () => {
    mockNavigate.mockReset();
    mockSetAccessToken.mockReset();
    mockGet.mockResolvedValue({
      data: "mocked_token"
    });

    await handleCallback("valid_code", mockNavigate, new AbortController().signal);

    expect(mockSetAccessToken).toHaveBeenCalledWith("mocked_token");
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  test("failure should navigate to login page", async () => {
    mockNavigate.mockReset();
    mockSetAccessToken.mockReset();
    const mockError = new AxiosError();
    mockError.message = "unauthorized";
    mockGet.mockRejectedValue(mockError);

    await handleCallback("invalid_code", mockNavigate, new AbortController().signal);

    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});