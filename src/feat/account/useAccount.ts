import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createAccount,
	editPassword,
	getAccount,
	getAccountNameByAccountNumber,
	updateAccount,
} from "./account.service";
import { type CreateAccountRequest, type UpdateAccountRequest } from './account.type';
import { queryClient } from "../../config/userQuery.config";


export const useCreateAccount = () => {
	return useMutation({
		mutationKey: ["create-account"],
		mutationFn: ({ createAccountRequest}: { createAccountRequest: CreateAccountRequest;}) => {
			return createAccount(createAccountRequest);
		},
		
	});
};

export const useUpdateAccount = () => {
	return useMutation({
		mutationKey: ["update-account"],
		mutationFn: ({ updateAccountRequest }: { updateAccountRequest: UpdateAccountRequest }) => {
			return updateAccount(updateAccountRequest);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-account"] });
		},
	});
};

export const useEditPassword = () => {
	return useMutation({
		mutationKey: ["edit-password"],
		mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
			return editPassword(currentPassword, newPassword);
		},
	});
};

	export const useGetAccountQuery = () => {
		return useQuery({
			queryKey: ["my-account"],
			queryFn: ({signal} ) => getAccount(signal),
			staleTime: 10 * 60 * 1000, // 10 minutes
		});
	};

	export const useGetAccountNameByAccountNumberQuery = (accountNumber: string) => {
		return useQuery({
			queryKey: ["account-name", accountNumber],
			queryFn: ({signal}) => getAccountNameByAccountNumber(accountNumber, signal),
			enabled: !!accountNumber && accountNumber.length === 12 && /^\d{12}$/.test(accountNumber), // only run this query if accountNumber is not empty and has 12 digits
			staleTime: 1 * 60 * 1000, // 1 minute
		});
	};
