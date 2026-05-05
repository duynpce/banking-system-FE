import { server } from '../../config/server.config';
import { ROOT_API_URL } from '../../../src/shared/constant/constant';
import { delay, http } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom'; //temp will be set as global in vitest config file
import { toast } from 'react-toastify';
import Register from '../../../src/feat/auth/register/Register';

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
    return new Response(JSON.stringify({ message: "registered successfully" }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: "registration failed" }), { status: 400 });
  }
}));

server.use(http.get(`${ROOT_API_URL}/v1/:resource/exists/:field/:value`, async ({ params}) => {
  if (params.value?.includes("existed")) {
    return new Response(JSON.stringify({ data: true }), { status: 200 });
  } else{
    return new Response(JSON.stringify({ data: false }), { status: 200 });
  }
}));

describe('Register component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderRegisterPage = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<div>Login page</div>              
            } />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('success, should show success toast message', async () => {

    const user = userEvent.setup();
    const toastSuccessSpy = vi
      .spyOn(toast, 'success')
      .mockImplementation(() => 'mock-toast-id');
    renderRegisterPage();
 
    await user.type(screen.getByPlaceholderText("Enter username"), "valid_username");
    await user.type(screen.getByPlaceholderText("Enter password"), "valid_password1A@");
    await user.type(screen.getByPlaceholderText("Enter email"), "valid_username@example.com");
    await user.type(screen.getByPlaceholderText("Enter phone number (9 - 11 digits)"), "1234567890");
    await user.type(screen.getByPlaceholderText("Enter address"), "valid_address");
    await user.type(screen.getByPlaceholderText("Enter full name"), "Valid_full_name");
    await user.type(screen.getByPlaceholderText("Enter ID card number (9-12 digits)"), "1234567890");
    fireEvent.change(screen.getByLabelText("date of birth"), { target: { value: "2000-01-01" } });
    await user.selectOptions(screen.getByLabelText("gender"), "MALE");
    await user.click(screen.getByText("Register"));
    await delay(1000);

    await waitFor(() => expect(toastSuccessSpy).toHaveBeenCalledWith("registered successfully"));
  }, 10000 ); //10000 is time out

  it('should show error message when username is already taken before submit', async () => {
    const user = userEvent.setup();
    renderRegisterPage();
    await user.type(screen.getByPlaceholderText("Enter username"), "existed_username");
    expect(await screen.findByText("Username already exists", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeDisabled();

  });
});



 