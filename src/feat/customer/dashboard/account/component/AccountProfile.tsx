import Button from "../../../../../shared/component/Button";
import Card from "../../../../../shared/component/Card";
import ImgButton from "../../../../../shared/component/ImgButton";
import InputWithLabel from "../../../../../shared/component/InputWithLabel";
import LabelValue from "../../../../../shared/component/LabelValue";
import Modal from "../../../../../shared/component/Modal";
import editIcon from "../../../../../assets/icon/edit.svg";
import { AccountType } from "../../../../account/account.type";
import {useAccountProfile  } from "../hook/useAccountProfile";
import { inputClass } from "../../../../../shared/constant/className.costant";

const getUniqueHint = (value: string, exists: boolean, isEditing: boolean) => {
	if (!isEditing || !value) {
		return null;
	}

	return (
		<p className={`text-sm ${exists ? "text-red-500" : "text-green-500"}`}>
			{exists ? "This value already exists" : "This value is available"}
		</p>
	);
};

const AccountProfile = () => {
	const {
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
		isSubmitting,
	} = useAccountProfile();

	const readOnlyFieldHint = isEditing ? "you can not edit this field" : undefined;


	return (
		<Card
			className="col-span-12"
			innerClassName="bg-white"
			isLoading={isLoading}
			isFetching={isFetching}
		>
			{!isEditing && (
				<div className="mb-5 flex justify-end">
					<ImgButton
						type="button"
						src={editIcon}
						alt="Edit profile"
						className="h-10 w-10 rounded-full border border-gray-300 bg-gray-300 p-2 hover:bg-green-300"
						onClick={onEdit}
					/>
				</div>
			)}

			<form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>

				<div title={readOnlyFieldHint} className={isEditing ? "cursor-not-allowed" : ""}>
					<LabelValue
						label="Account Number"
						value={account?.number ?? "-"}
					/>
				</div>
				<div title={readOnlyFieldHint} className={isEditing ? "cursor-not-allowed" : ""}>
					<LabelValue
						label="Type"
						value={account?.type ?? "-"}
					/>
				</div>
				<div title={readOnlyFieldHint} className={isEditing ? "cursor-not-allowed" : ""}>
					<LabelValue
						label="Status"
						value={account?.status ?? "-"}
					/>
				</div>
				<div title={readOnlyFieldHint} className={isEditing ? "cursor-not-allowed" : ""}>
					<LabelValue
						label="Balance"
						value={account ? account.balance.toFixed(4) : "-"}
					/>
				</div>
				
				<div className="flex flex-col gap-1">
					<InputWithLabel
						label="Email"
						type="email"
						blockClassName="w-full"
						className={inputClass}
						disabled={!isEditing}
						{...register("email", {
							onChange: (event) => handleUniqueFieldChange("email", event.target.value),
						})}
					/>
					{getUniqueHint(uniqueDetails.email.value, uniqueDetails.email.exists, isEditing)}
				</div>

				<div className="flex flex-col gap-1">
					<InputWithLabel
						label="Phone Number"
						blockClassName="w-full"
						className={inputClass}
						disabled={!isEditing}
						{...register("phoneNumber", {
							onChange: (event) => handleUniqueFieldChange("phoneNumber", event.target.value),
						})}
					/>
					{getUniqueHint(uniqueDetails.phoneNumber.value, uniqueDetails.phoneNumber.exists, isEditing)}
				</div>

				<InputWithLabel
					label="Address"
					blockClassName="w-full md:col-span-2"
					className={inputClass}
					disabled={!isEditing}
					{...register("address")}
				/>

				{account?.type === AccountType.PERSONAL && (
					<>
						<InputWithLabel
							label="Full Name"
							blockClassName="w-full"
							className={inputClass}
							disabled={!isEditing}
							{...register("fullName")}
						/>

						<InputWithLabel
							label="Date Of Birth"
							type="date"
							blockClassName="w-full"
							className={inputClass}
							disabled={!isEditing}
							{...register("dateOfBirth")}
						/>

						<div className="flex flex-col gap-1 md:col-span-2">
							<InputWithLabel
								label="ID Card Number"
								blockClassName="w-full"
								className={inputClass}
								disabled={!isEditing}
								{...register("idCardNumber", {
									onChange: (event) => handleUniqueFieldChange("idCardNumber", event.target.value),
								})}
							/>
							{getUniqueHint(uniqueDetails.idCardNumber.value, uniqueDetails.idCardNumber.exists, isEditing)}
						</div>
					</>
				)}

				{account?.type === AccountType.BUSINESS && (
					<>
						<InputWithLabel
							label="Organization Name"
							blockClassName="w-full"
							className={inputClass}
							disabled={!isEditing}
							{...register("organizationName")}
						/>

						<div className="flex flex-col gap-1">
							<InputWithLabel
								label="Tax ID Number"
								blockClassName="w-full"
								className={inputClass}
								disabled={!isEditing}
								{...register("taxIdNumber", {
									onChange: (event) => handleUniqueFieldChange("taxIdNumber", event.target.value),
								})}
							/>
							{getUniqueHint(uniqueDetails.taxIdNumber.value, uniqueDetails.taxIdNumber.exists, isEditing)}
						</div>
					</>
				)}

				{account?.type === AccountType.GOVERNMENT && (
					<InputWithLabel
						label="Government Department"
						blockClassName="w-full md:col-span-2"
						className={inputClass}
						disabled={!isEditing}
						{...register("governmentDepartment")}
					/>
				)}

				{isEditing && (
					<div className="mt-2 flex gap-3 md:col-span-2">
						<Button
							type="button"
							content="Confirm"
							onClick={openConfirmModal}
							disabled={hasAnUniqueDetailExists}
							className="rounded-xl px-8 disabled:cursor-not-allowed disabled:bg-gray-400"
						/>
						<Button
							type="button"
							content="Cancel"
							onClick={onCancelEdit}
							className="rounded-xl bg-gray-300 px-8 text-gray-800 hover:bg-gray-400"
						/>
					</div>
				)}
			</form>

			<Modal
				isOpen={isConfirmModalOpen}
				onClose={closeConfirmModal}
				title="Confirm Updating Profile"
			>
				<div className="flex flex-col gap-4">
					<p className="text-sm text-gray-600">
						here is your updating profile please re-check the information because you cannot edit you profile in 48 hours
					</p>

					<div className="grid grid-cols-1 gap-2 rounded-xl border border-gray-200 p-3 text-sm md:grid-cols-2">
						<p><span className="font-semibold">Email:</span> {watchingValues.email}</p>
						<p><span className="font-semibold">Phone Number:</span> {watchingValues.phoneNumber}</p>
						<p className="md:col-span-2"><span className="font-semibold">Address:</span> {watchingValues.address}</p>

						{account?.type === AccountType.PERSONAL && (
							<>
								<p><span className="font-semibold">Full Name:</span> {"fullName" in watchingValues ? watchingValues.fullName : ""}</p>
								<p><span className="font-semibold">Date Of Birth:</span> {"dateOfBirth" in watchingValues ? watchingValues.dateOfBirth : ""}</p>
								<p className="md:col-span-2"><span className="font-semibold">ID Card Number:</span> {"idCardNumber" in watchingValues ? watchingValues.idCardNumber : ""}</p>
							</>
						)}

						{account?.type === AccountType.BUSINESS && (
							<>
								<p><span className="font-semibold">Organization Name:</span> {"organizationName" in watchingValues ? watchingValues.organizationName : ""}</p>
								<p><span className="font-semibold">Tax ID Number:</span> {"taxIdNumber" in watchingValues ? watchingValues.taxIdNumber : ""}</p>
							</>
						)}

						{account?.type === AccountType.GOVERNMENT && (
							<p className="md:col-span-2">
								<span className="font-semibold">Government Department:</span> {"governmentDepartment" in watchingValues ? watchingValues.governmentDepartment : ""}
							</p>
						)}
					</div>

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
							onClick={submitUpdate}
							disabled={isSubmitting || hasAnUniqueDetailExists}
							className="rounded-xl px-6 disabled:cursor-not-allowed disabled:bg-gray-400"
						/>
					</div>
				</div>
			</Modal>
		</Card>
	);
};

export default AccountProfile;
