import {  expect, test , describe} from "vitest";
import { getErrorMessage } from '../../src/auth/login/LoginService';


describe("test getErrorMessage", () => {
  test("should return empty string when error is null", () => {
    expect(getErrorMessage(null)).toBe("");
  });

  test("should return correct message for invalid-credentials", () => {
    expect(getErrorMessage("invalid-credentials"))
      .toBe("Not existed account or incorrect password");
  });

  test("should return correct message for authentication-failed", () => {
    expect(getErrorMessage("authentication-failed"))
      .toBe("Authentication failed");
  });

  test("should return unknown error for other cases", () => {
    expect(getErrorMessage("something-else"))
      .toBe("unknown error");
  });
});