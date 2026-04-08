import {  expect, test , describe, vi, type Mock} from "vitest";
import { AxiosError } from "axios";
// import { handleRegister, checkUniqueField } from '../../../src/feat/auth/register/register.service';
// import { AccountType } from "../../../src/feat/account/account.type";
import { api } from "../../../src/config/axios/api";
import { checkUniqueField } from "../../../src/feat/auth/register/register.service";

vi.mock("../../../src/config/axios/api", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));
// const mockPost = api.post as Mock;
const mockGet = api.get as Mock;



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
