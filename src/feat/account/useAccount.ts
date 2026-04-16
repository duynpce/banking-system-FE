import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createAccount,
	getAccount,
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

	export const useGetAccountQuery = () => {
		return useQuery({
			queryKey: ["my-account"],
			queryFn: ({signal} ) => getAccount(signal),
			staleTime: 10 * 60 * 1000, // 10 minutes
		});
	};

