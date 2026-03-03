import { server } from '../../mocks/Server';
import { ROOT_API_URL } from '../../../src/shared/Constant';
import { delay, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Register from '../../../src/auth/register/Register';

type personalAccountRequestBody = {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  idCardNumber: string;
  dateOfBirth: Date;
}

server.use(http.post(`${ROOT_API_URL}/v1/personal-accounts`,async ({request}) => {
  const body = await request.json() as personalAccountRequestBody;
  if (body.username?.includes("valid")){
    return new Response(JSON.stringify("registered successfully"), { status: 200 });
  }else{
    return new Response(JSON.stringify("registration failed"), { status: 400 });
  }
}));

server.use(http.get(`${ROOT_API_URL}/v1/*/exists/*/:value`, async ({ params}) => {
  if (params.value?.includes("existed")) {
    return new Response(JSON.stringify(true), { status: 200 });
  } else{
    return new Response(JSON.stringify(false), { status: 200 });
  }
}));

describe('Register component', () => {
  it('success, should alert success message', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    )
 
    await user.type(screen.getByPlaceholderText("Username"), "valid_username");
    await user.type(screen.getByPlaceholderText("Password"), "valid_password");
    await user.type(screen.getByPlaceholderText("Email"), "valid_username@example.com");
    await user.type(screen.getByPlaceholderText("Phone Number"), "valid_phone_number");
    await user.type(screen.getByPlaceholderText("Address"), "valid_address");
    await user.type(screen.getByPlaceholderText("Full name"), "Valid_full_name");
    await user.type(screen.getByPlaceholderText("Id card number"), "123456789");
    fireEvent.change(screen.getByLabelText("date of birth"), { target: { value: "2000-01-01" } });
    await user.selectOptions(screen.getByLabelText("gender"), "MALE");
    await user.click(screen.getByText("register"));
    delay(1000);

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith("registered successfully"));
  }); 

  it('should show error message when username is already taken before submit', async () => {
    const user = userEvent.setup();
    render(
        <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText("Username"), "existed_username");
    await delay(1000);
    await waitFor(() => expect(screen.getByText("existed username")).toBeInTheDocument());


  });
});



 