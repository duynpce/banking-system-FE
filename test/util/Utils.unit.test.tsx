
import type { ChangeEvent } from "react";
import {  expect, test, vi } from "vitest";
import { handleChange, handleChangeValueForUniqueDetails, handleChangeExistsForUniqueDetails, trimObjectValues } from '../../src/utils/Util';

test("test handleChange " ,  () => {
    //evm
    const mockState = vi.fn();
    
    const initialState = {
      username: "username",
      password: "password"
    };

    const handler = handleChange(mockState);

     const mockEvent = {
       target: {
         name: "username",
         value: "newUsername"
       }
     } as unknown as ChangeEvent<HTMLInputElement>;

    handler(mockEvent);

    //store as [[handleChange's logic so take it back]]
    const stateUpdater = mockState.mock.calls[0][0];
    const newState = stateUpdater(initialState);

    expect(newState).toEqual({
      username: "newUsername",
      password: "password"
    });

  })

test("test handleChangeValueForUniqueDetails", () => {
    //evm
    const mockSetUniqueDetails = vi.fn();
    
    const initialState = {
      email: {
        value: "old@example.com",
        exists: false
      },
      phone: {
        value: "123456",
        exists: true
      }
    };

    handleChangeValueForUniqueDetails(mockSetUniqueDetails, "email", "new@example.com");

    //store as [[handleChangeValueForUniqueDetails's logic so take it back]]
    const stateUpdater = mockSetUniqueDetails.mock.calls[0][0];
    const newState = stateUpdater(initialState);

    expect(newState).toEqual({
      email: {
        value: "new@example.com",
        exists: false
      },
      phone: {
        value: "123456",
        exists: true
      }
    });
});

test("test handleChangeExistsForUniqueDetails", () => {
    //evm
    const mockSetUniqueDetails = vi.fn();
    
    const initialState = {
      email: {
        value: "test@example.com",
        exists: false
      },
      phone: {
        value: "123456",
        exists: true
      }
    };

    handleChangeExistsForUniqueDetails(mockSetUniqueDetails, "email", true);

    //store as [[handleChangeExistsForUniqueDetails's logic so take it back]]
    const stateUpdater = mockSetUniqueDetails.mock.calls[0][0];
    const newState = stateUpdater(initialState);

    expect(newState).toEqual({
      email: {
        value: "test@example.com",
        exists: true
      },
      phone: {
        value: "123456",
        exists: true
      }
    });
});

test("test trimObjectValues", () => {
    //evm
    const inputObject = {
      username: "  testUser  ",
      password: "  pass123  ",
      age: 25,
      active: true
    };

    const result = trimObjectValues(inputObject);

    expect(result).toEqual({
      username: "testUser",
      password: "pass123",
      age: 25,
      active: true
    });
});
