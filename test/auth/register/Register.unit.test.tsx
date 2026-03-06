import {  expect, test , describe, vi} from "vitest";
import axios, { AxiosError } from "axios";
import { handleRegister, checkUniqueField } from '../../../src/auth/register/register.service';
import { AccountType } from "../../../src/types/account.type";

vi.mock("axios");
const mockedAxios = vi.mocked(axios,true);
describe("test handleRegister", () => {
  test("success", async() => {
    const formData = new FormData();
    
    mockedAxios.post.mockResolvedValue({
      data: "create business account successfully"
    })

    const result = await handleRegister(AccountType.BUSINESS,formData);

    expect(result).toEqual("create business account successfully");
    expect(mockedAxios.post).toBeCalledTimes(1);

  })

  test("failed", async() => {
    const formData = new FormData();
    
    const axiosError = new AxiosError();
    axiosError.message = "invalid password";
    mockedAxios.post.mockRejectedValue(axiosError);

    try {
      await handleRegister(AccountType.BUSINESS,formData);
    }
    catch(err) {
      const error = err as Error;
      expect(error.message).toEqual("invalid password");
    }

    expect(mockedAxios.post).toBeCalledTimes(1);

  })  
})

describe("test checkUniqueField", () => {
  test("success", async() => {
    mockedAxios.get.mockResolvedValue({
      data: true
    })

    const result = await checkUniqueField("username", "testuser");

    expect(result).toEqual(true);
    expect(mockedAxios.get).toBeCalledTimes(1);

  })

  test("failed", async() => {
    const axiosError = new AxiosError();
    axiosError.message = "network error";
    mockedAxios.get.mockRejectedValue(axiosError);

    try {
      await checkUniqueField("email", "test@example.com");
    }
    catch(err) {
      const error = err as Error;
      expect(error.message).toEqual("network error");
    }

    expect(mockedAxios.get).toBeCalledTimes(1);

  })
})  
