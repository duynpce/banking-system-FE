import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEditPassword } from "../../../../account/useAccount";
import { useFormCustom } from "../../../../../shared/hook/useFormCustom";
import { editPasswordRequestSchema, type EditPasswordRequest } from "../../../../account/account.type";


export const useEditPasswordSection = () => {
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [confirmError, setConfirmError] = useState("");

	const editPasswordMutation = useEditPassword();

	const {
		register,
		handleSmartSubmit,
		getValues,
		reset,
		formState: { isSubmitting },
	} = useFormCustom<EditPasswordRequest>({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
		resolver: zodResolver(editPasswordRequestSchema),
	});

	const openConfirmModal = handleSmartSubmit(() => {
		setConfirmError("");
		setConfirmNewPassword("");
		setIsConfirmModalOpen(true);
	});

	const closeConfirmModal = () => {
		setIsConfirmModalOpen(false);
		setConfirmError("");
		setConfirmNewPassword("");
	};

	const submitPasswordUpdate = () => {
		const currentPassword = getValues("currentPassword");
		const newPassword = getValues("newPassword");

		if (confirmNewPassword !== newPassword) {
			setConfirmError("Confirm password does not match with new password");
			return;
		}

		editPasswordMutation.mutate(
			{ currentPassword, newPassword },
			{
				onSuccess: () => {
					closeConfirmModal();
					reset();
				},
			}
		);
	};

	return {
		register,
		isConfirmModalOpen,
		openConfirmModal,
		closeConfirmModal,
		confirmNewPassword,
		setConfirmNewPassword,
		confirmError,
		submitPasswordUpdate,
		isSubmitting: isSubmitting || editPasswordMutation.isPending,
	};
};
