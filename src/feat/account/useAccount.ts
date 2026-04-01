import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createAccount,
	getAccount,
	updateAccount,
} from "./account.service";
import { AccountType } from './account.type';
import { queryClient } from "../../config/userQuery.config";


export const useCreateAccount = () => {
	return useMutation({
		mutationKey: ["create-account"],
		mutationFn: ({ formData, accountType }: { formData: FormData; accountType: AccountType }) => {
			return createAccount(formData, accountType);
		},
		
	});
};

export const useUpdateAccount = () => {
	return useMutation({
		mutationKey: ["update-account"],
		mutationFn: ({ formData, accountType }: { formData: FormData; accountType: AccountType }) => {
			return updateAccount(formData, accountType);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-account"] });
		},
	});
};

	export const useGetAccountQuery = () => {
		return useQuery({
			queryKey: ["my-account"],
			queryFn: () => getAccount(),
			staleTime: 10 * 60 * 1000, // 10 minutes
		});
	};

