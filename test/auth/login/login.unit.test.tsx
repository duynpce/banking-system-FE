import {  expect, test , describe} from "vitest";
import { getMessage } from '../../../src/feat/auth/login/login.service';


describe("test getMessage", () => {
  test("should return empty string when no params", () => {
    expect(getMessage()).toBe("");
  });

  test("should return specific error for invalid-credentials", () => {
    const searchParams = new URL("http://localhost?error=invalid-credentials").searchParams;
    expect(getMessage(searchParams)).toBe("Not existed account or incorrect password");
  });

  test("should return specific error for authentication-failed", () => {
    const searchParams = new URL("http://localhost?error=authentication-failed").searchParams;
    expect(getMessage(searchParams)).toBe("Authentication failed");
  });

  test("should return alert config string for non-error param", () => {
    const searchParams = new URL("http://localhost?typeofOperation=state").searchParams;
    expect(getMessage(searchParams)).toBe("typeofOperation: state");
  });

  test("should return first key/value for multi params using alert config", () => {
    const searchParams = new URL("http://localhost?typeofOperation=state&other=foo").searchParams;
    expect(getMessage(searchParams)).toBe("typeofOperation: state");
  });
});