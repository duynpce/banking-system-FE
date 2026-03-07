import {  expect, test , describe, vi, type Mock} from "vitest";
import { AxiosError } from "axios";
import { handleRegister, checkUniqueField } from '../../../src/auth/register/register.service';
import { AccountType } from "../../../src/types/account.type";
import { api } from "../../../src/utils/api";

vi.mock("../../../src/utils/api", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));
const mockPost = api.post as Mock;
const mockGet = api.get as Mock;
describe("test handleRegister", () => {
  test("success", async() => {
    const formData = new FormData();
    
    mockPost.mockResolvedValue({
      data: "create business account successfully"
    })

    const result = await handleRegister(AccountType.BUSINESS,formData);

    expect(result).toEqual("create business account successfully");
    expect(mockPost).toBeCalledTimes(1);

  })

  test("failed", async() => {
    const formData = new FormData();
    
    const axiosError = new AxiosError();
    axiosError.message = "invalid password";
    mockPost.mockRejectedValue(axiosError);

    try {
      await handleRegister(AccountType.BUSINESS,formData);
    }
    catch(err) {
      const error = err as Error;
      expect(error.message).toEqual("invalid password");
    }

    expect(mockPost).toBeCalledTimes(1);

  })  
})

describe("test checkUniqueField", () => {
  test("success", async() => {
    mockGet.mockResolvedValue({
      data: true
    })

    const result = await checkUniqueField("username", "testuser");

    expect(result).toEqual(true);
    expect(mockGet).toBeCalledTimes(1);

  })

  test("failed", async() => {
    const axiosError = new AxiosError();
    axiosError.message = "network error";
    mockGet.mockRejectedValue(axiosError);

    try {
      await checkUniqueField("email", "test@example.com");
    }
    catch(err) {
      const error = err as Error;
      expect(error.message).toEqual("network error");
    }

    expect(mockGet).toBeCalledTimes(1);

  })
})  
