import axios, { AxiosError } from 'axios';
import { describe, expect, test, vi } from 'vitest';
import { handleCallback } from '../../../src/auth/common/callback.service';

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);
const mockNavigate = vi.fn();

describe("test handleCallback", () => {
  test("success should navigate to home page", async () => {
    mockedAxios.get.mockResolvedValue({
      data: "mocked_token"
    });

    await handleCallback("valid_code", mockNavigate, new AbortController().signal);

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer mocked_token");
  });

  test("failure should navigate to login page", async () => {
    const mockError = new AxiosError();
    mockError.message = "unauthorized";
    mockedAxios.get.mockRejectedValue(mockError);

    await handleCallback("invalid_code", mockNavigate, new AbortController().signal);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});