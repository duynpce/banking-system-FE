import Button from "../../../../../shared/component/Button";
import Card from "../../../../../shared/component/Card";
import InputWithLabel from "../../../../../shared/component/InputWithLabel";
import Modal from "../../../../../shared/component/Modal";
import { inputClass } from "../../../../../shared/constant/className.costant";
import { useEditPasswordSection } from "../hook/useEditPasswordSection";

const EditPasswordSection = () => {
	const {
		register,
		isConfirmModalOpen,
		openConfirmModal,
		closeConfirmModal,
		confirmNewPassword,
		setConfirmNewPassword,
		confirmError,
		submitPasswordUpdate,
		isSubmitting,
	} = useEditPasswordSection();


	return (
		<Card title="Edit Password" className="col-span-12" innerClassName="bg-white">
			<form className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4" onSubmit={(event) => event.preventDefault()}>
				<InputWithLabel
					label="Current Password"
					type="password"
					placeholder="Enter current password"
					className={inputClass}
					{...register("currentPassword")}
				/>

				<InputWithLabel
					label="New Password"
					type="password"
					placeholder="Enter new password"
					className={inputClass}
					{...register("newPassword")}
				/>

				<Button
					type="button"
					content="Save"
					onClick={openConfirmModal}
					className="mt-2 w-full rounded-xl md:w-1/3"
				/>
			</form>

			<Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} title="Confirm Password Update">
				<div className="flex flex-col gap-4">
					<p className="text-sm text-gray-600">Please enter your new password again to submit this password update.</p>

					<InputWithLabel
						label="Confirm New Password"
						type="password"
						placeholder="Re-enter new password"
						className={inputClass}
						value={confirmNewPassword}
						onChange={(event) => {
							setConfirmNewPassword(event.target.value);
						}}
					/>

					{confirmError && <p className="text-sm text-red-500">{confirmError}</p>}

					<div className="flex justify-end gap-3">
						<Button
							type="button"
							content="Cancel"
							onClick={closeConfirmModal}
							className="rounded-xl bg-gray-300 px-6 text-gray-800 hover:bg-gray-400"
						/>
						<Button
							type="button"
							content="Submit"
							onClick={submitPasswordUpdate}
							disabled={isSubmitting}
							className="rounded-xl px-6 disabled:cursor-not-allowed disabled:bg-gray-400"
						/>
					</div>
				</div>
			</Modal>
		</Card>
	);
};

export default EditPasswordSection;
