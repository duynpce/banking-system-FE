import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import {
	checkUniqueField,
	type UniqueField,
	type UniqueDetail,
} from "../../../../account/account.service";
import {
	AccountType,
	updateAccountRequestSchema,
	type AccountDetailDto,
	type UpdateAccountRequest,
} from "../../../../account/account.type";
import { useGetAccountQuery, useUpdateAccount } from "../../../../account/useAccount";
import { useFormCustom } from "../../../../../shared/hook/useFormCustom";
import {
	handleChangeExistsForUniqueDetails,
	handleChangeValueForUniqueDetails,
} from "../../../../../shared/utils/util";

type EditUniqueField = Extract<UniqueField, "email" | "phoneNumber" | "idCardNumber" | "taxIdNumber">;
type EditUniqueDetail = Pick<UniqueDetail, EditUniqueField>;

const defaultUniqueDetails: EditUniqueDetail = {
	email: { value: "", exists: false },
	phoneNumber: { value: "", exists: false },
	idCardNumber: { value: "", exists: false },
	taxIdNumber: { value: "", exists: false },
};

export const useAccountProfile = () => {
	const { data, isLoading, isFetching } = useGetAccountQuery();
	const account = data as AccountDetailDto | null;
	const updateAccountMutation = useUpdateAccount();

	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	const [uniqueDetails, setUniqueDetails] = useState<EditUniqueDetail>(defaultUniqueDetails);

	const uniqueFieldMutation = useMutation({
		mutationFn: ({ name, value }: { name: EditUniqueField; value: string }) => checkUniqueField(name, value),
	});
	const { mutateAsync: mutateUniqueFieldAsync } = uniqueFieldMutation;

	const {
		register,
		setValue,
		handleSmartSubmit,
		watch,
		formState: { isSubmitting },
	} = useFormCustom<UpdateAccountRequest>({
		defaultValues: {
			type: AccountType.PERSONAL,
			email: "",
			phoneNumber: "",
			address: "",
			fullName: "",
			idCardNumber: "",
			dateOfBirth: "",
		} as UpdateAccountRequest,
		resolver: zodResolver(updateAccountRequestSchema),
	});

	const resetUniqueState = (nextAccount: AccountDetailDto | null) => {
		setUniqueDetails({
			email: { value: nextAccount?.email ?? "", exists: false },
			phoneNumber: { value: nextAccount?.phoneNumber ?? "", exists: false },
			idCardNumber: {
				value: nextAccount?.type === AccountType.PERSONAL && "idCardNumber" in nextAccount ? nextAccount.idCardNumber : "",
				exists: false,
			},
			taxIdNumber: {
				value: nextAccount?.type === AccountType.BUSINESS && "taxIdNumber" in nextAccount ? nextAccount.taxIdNumber : "",
				exists: false,
			},
		});
	};

	useEffect(() => {
		if (!account) {
			return;
		}

		setValue("type", account.type);
		setValue("email", account.email);
		setValue("phoneNumber", account.phoneNumber);
		setValue("address", account.address);

		if (account.type === AccountType.PERSONAL) {
			setValue("fullName", "fullName" in account ? account.fullName : "");
			setValue("idCardNumber", "idCardNumber" in account ? account.idCardNumber : "");
			setValue("dateOfBirth", "dateOfBirth" in account ? account.dateOfBirth : "");
		}

		if (account.type === AccountType.BUSINESS) {
			setValue("organizationName", "organizationName" in account ? account.organizationName : "");
			setValue("taxIdNumber", "taxIdNumber" in account ? account.taxIdNumber : "");
		}

		if (account.type === AccountType.GOVERNMENT) {
			setValue("governmentDepartment", "governmentDepartment" in account ? account.governmentDepartment : "");
		}

	}, [account, setValue]);

	const hasAnUniqueDetailExists = useMemo(
		() => Object.values(uniqueDetails).some((detail) => detail.exists),
		[uniqueDetails]
	);

	const debouncedCheckUniqueField = useMemo(
		() =>
			_.debounce(async (name: EditUniqueField, value: string) => {
				const defaultExists = false;
				const normalizedValue = value.trim();

				if (!normalizedValue) {
					handleChangeExistsForUniqueDetails(setUniqueDetails, name, defaultExists);
					return;
				}

				const accountValue =
					name === "email"
						? account?.email
						: name === "phoneNumber"
						? account?.phoneNumber
						: name === "idCardNumber" && account?.type === AccountType.PERSONAL && "idCardNumber" in account
						? account.idCardNumber
						: name === "taxIdNumber" && account?.type === AccountType.BUSINESS && "taxIdNumber" in account
						? account.taxIdNumber
						: "";

				if ((accountValue ?? "").trim() === normalizedValue) {
					handleChangeExistsForUniqueDetails(setUniqueDetails, name, defaultExists);
					return;
				}

				let exists = defaultExists;

				try {
					exists = (await mutateUniqueFieldAsync({ name, value: normalizedValue })) ?? defaultExists;
				} catch {
					exists = defaultExists;
				}

				handleChangeExistsForUniqueDetails(setUniqueDetails, name, exists);
			}, 750),
		[account, mutateUniqueFieldAsync]
	);

	useEffect(() => {
		return () => {
			debouncedCheckUniqueField.cancel();
		};
	}, [debouncedCheckUniqueField]);

	const handleUniqueFieldChange = (name: EditUniqueField, value: string) => {
		handleChangeValueForUniqueDetails(setUniqueDetails, name, value);
		debouncedCheckUniqueField(name, value);
	};

	const onEdit = () => {
		setIsEditing(true);
	};

	const onCancelEdit = () => {
		if (!account) {
			return;
		}

		setIsEditing(false);
		setIsConfirmModalOpen(false);

		setValue("email", account.email);
		setValue("phoneNumber", account.phoneNumber);
		setValue("address", account.address);

		if (account.type === AccountType.PERSONAL) {
			setValue("fullName", "fullName" in account ? account.fullName : "");
			setValue("idCardNumber", "idCardNumber" in account ? account.idCardNumber : "");
			setValue("dateOfBirth", "dateOfBirth" in account ? account.dateOfBirth : "");
		}

		if (account.type === AccountType.BUSINESS) {
			setValue("organizationName", "organizationName" in account ? account.organizationName : "");
			setValue("taxIdNumber", "taxIdNumber" in account ? account.taxIdNumber : "");
		}

		if (account.type === AccountType.GOVERNMENT) {
			setValue("governmentDepartment", "governmentDepartment" in account ? account.governmentDepartment : "");
		}

		resetUniqueState(account);
	};

	const openConfirmModal = handleSmartSubmit(() => {
		if (hasAnUniqueDetailExists) {
			return;
		}

		setIsConfirmModalOpen(true);
	});

	const closeConfirmModal = () => {
		setIsConfirmModalOpen(false);
	};

	const onSubmitUpdate = (updateAccountRequest: UpdateAccountRequest) => {
		updateAccountMutation.mutate(
			{ updateAccountRequest },
			{
				onSuccess: () => {
					setIsConfirmModalOpen(false);
					setIsEditing(false);
					resetUniqueState(account);
				},
			}
		);
	};

	const submitUpdate = handleSmartSubmit(onSubmitUpdate);

	const watchingValues = watch();

	return {
		account,
		isLoading,
		isFetching,
		isEditing,
		uniqueDetails,
		hasAnUniqueDetailExists,
		register,
		handleUniqueFieldChange,
		onEdit,
		onCancelEdit,
		openConfirmModal,
		isConfirmModalOpen,
		closeConfirmModal,
		submitUpdate,
		watchingValues,
		isSubmitting: isSubmitting || updateAccountMutation.isPending,
	};
};
