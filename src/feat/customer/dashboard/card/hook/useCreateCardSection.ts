import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useGetAccountQuery } from "../../../../account/useAccount";
import type { CardPrivilegeDto } from "../../../../card/card.privilege.type";
import { CardType, CreateCardRequestSchema, type CreateCardRequest } from "../../../../card/card.type";
import { useGetCardPrivilegesByAccountTypeAndCardTypeQuery } from "../../../../card/useCardPrivilege";
import { useCreateCard } from "../../../../card/useCard";
import { useFormCustom } from "../../../../../shared/hook/useFormCustom";

export const useCreateCardSection = () => {
	const createCardMutation = useCreateCard();
	const account = useGetAccountQuery().data;
	const accountType = account?.type;

	const [cardType, setCardType] = useState<CardType>(CardType.CREDIT);
	const {
		data: privileges,
		isLoading: isPrivilegesLoading,
	} = useGetCardPrivilegesByAccountTypeAndCardTypeQuery(accountType ?? "PERSONAL", cardType);

	const [previousPrivileges, setPreviousPrivileges] = useState<CardPrivilegeDto[] | undefined>(privileges);
	const [selectedPrivilege, setSelectedPrivilege] = useState<CardPrivilegeDto | undefined>(privileges?.[0]);

	const [isCreateCardConfirmationModalOpen, setIsCreateCardConfirmationModalOpen] = useState(false);
	const [isPinCodeConfirmed, setIsPinCodeConfirmed] = useState(false);
	const [confirmPinCode, setConfirmPinCode] = useState("");

	if (privileges !== previousPrivileges) {
		setPreviousPrivileges(privileges);
		setSelectedPrivilege(privileges?.[0]);
	}

	const estimatedExpirationDate = useMemo(() => {
		const expiryYears = selectedPrivilege?.expirationYears;
		const date = new Date();

		if (!expiryYears) {
			return "";
		}

		date.setFullYear(date.getFullYear() + expiryYears);
		return date.toISOString().split("T")[0];
	}, [selectedPrivilege]);

	const {
		handleSmartSubmit,
		register,
		setValue,
		getValues,
		formState: { isSubmitting: isCreateCardSubmitting },
	} = useFormCustom<CreateCardRequest>({
		defaultValues: {
			forAccountType: accountType,
			privilegeCode: selectedPrivilege?.privilegeCode,
			type: cardType,
			pinCode: "",
			holder: "",
		},
		resolver: zodResolver(CreateCardRequestSchema),
	});

	useEffect(() => {
		setValue("forAccountType", accountType ?? "PERSONAL");
	}, [accountType, setValue]);

	const closeCreateCardConfirmationModal = () => {
		setIsCreateCardConfirmationModalOpen(false);
		setIsPinCodeConfirmed(false);
		setConfirmPinCode("");
	};

	const openCreateCardConfirmationModal = () => {
		setIsCreateCardConfirmationModalOpen(true);
		setIsPinCodeConfirmed(false);
		setConfirmPinCode("");
	};

	const handlerCreateCard = (request: CreateCardRequest) => {
		closeCreateCardConfirmationModal();
		createCardMutation.mutate(request);
	};

	const handleConfirmPinCode = () => {
		const originalPinCode = getValues("pinCode");

		if (confirmPinCode === originalPinCode) {
			setIsPinCodeConfirmed(true);
			return;
		}

		toast.error("Pin code does not match. Please try again.");
	};

	const registerType = register("type", {
		onChange: (event) => {
			const nextCardType = event.target.value as CardType;
			const nextSelectedPrivilege = privileges?.[0];

			setCardType(nextCardType);
			setSelectedPrivilege(nextSelectedPrivilege);
			setValue("privilegeCode", nextSelectedPrivilege?.privilegeCode ?? "");
		},
	});

	const registerPrivilegeCode = register("privilegeCode", {
		onChange: (event) => {
			const nextSelectedPrivilege = privileges?.find((item) => item.privilegeCode === event.target.value);
			setSelectedPrivilege(nextSelectedPrivilege);
		},
	});

	return {
		accountType,
		handleSmartSubmit,
		handlerCreateCard,
		register,
		registerType,
		registerPrivilegeCode,
		cardType,
		setCardType,
		privileges,
		isPrivilegesLoading,
		estimatedExpirationDate,
		selectedPrivilege,
		isCreateCardConfirmationModalOpen,
		openCreateCardConfirmationModal,
		closeCreateCardConfirmationModal,
		handleConfirmPinCode,
		isPinCodeConfirmed,
		isCreateCardSubmitting,
		confirmPinCode,
		setConfirmPinCode,
	};
};
