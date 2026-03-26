import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createAccount,
	getAccount,
	updateAccount,
} from "./account.service";
import { AccountType } from './account.type';


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
	});
};

	export const useGetAccountQuery = () => {
		return useQuery({
			queryKey: ["my-account"],
			queryFn: () => getAccount(),
		});
	};

