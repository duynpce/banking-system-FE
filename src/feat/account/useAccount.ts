import { useMutation, useQuery } from "@tanstack/react-query";
import {
	createAccount,
	getAccount,
	updateAccount,
} from "./account.service";
import { AccountType } from './account.type';

export const useAccount = () => {
	const useCreateAccount = useMutation({
		mutationKey: ["create-account"],
		mutationFn: ({formData, accountType}: { formData: FormData; accountType: AccountType }) => {
			return createAccount(formData, accountType);
		},
	});

	const useUpdateAccount = useMutation({
		mutationKey: ["update-account"],
		mutationFn: ({formData, accountType}: { formData: FormData; accountType: AccountType }) => {
			return updateAccount(formData, accountType);
		},
	});

	const useGetAccountQuery = useQuery({
		queryKey: ["my-account"],
		queryFn: () => getAccount(),
	});

	return {
		useCreateAccount,
		useUpdateAccount,
		useGetAccountQuery,
	};
};
