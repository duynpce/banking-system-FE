import Button from "../../../../../shared/component/Button";
import Card from "../../../../../shared/component/Card";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import Modal from "../../../../../shared/component/Modal";
import { CardType } from "../../../../card/card.type";
import { useCreateCardSection } from "../hook/useCreateCardSection";

const formatCardType = (cardType: string) => `${cardType[0]}${cardType.slice(1).toLowerCase()}`;

const CreateCardSection = () => {
	const {
		accountType,
		handleSmartSubmit,
		handlerCreateCard,
		register,
		registerType,
		registerPrivilegeCode,
		cardType,
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
	} = useCreateCardSection();

	const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none focus:ring-2 focus:ring-blue-300 bg-white";

	return (
		<Card title="Add New Card" className="col-span-12" innerClassName="bg-white">
			{isPrivilegesLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<form
						onSubmit={handleSmartSubmit((createCardRequest) => handlerCreateCard(createCardRequest))}
						className="grid grid-cols-2 gap-6"
						id="create-card-form"
					>
						<input type="hidden" value={accountType ?? "PERSONAL"} {...register("forAccountType")} />

						<div className="flex flex-col gap-1">
							<label className="text-sm text-gray-600">Card Type</label>
							{/* Keep form wiring inside register options to avoid overriding RHF's onChange handler. */}
							<select className={inputClass} defaultValue={cardType} {...registerType}>
								{Object.values(CardType).map((item) => (
									<option key={item} value={item}>
										{formatCardType(item)}
									</option>
								))}
							</select>
						</div>

						{accountType === "BUSINESS" && (
							<div className="flex flex-col gap-1">
								<label className="text-sm text-gray-600">Card Holder</label>
								<input
									className={inputClass}
									placeholder="My Cards"
									{...register("holder")}
								/>
							</div>
						)}

						<div className="flex flex-col gap-1">
							<label className="text-sm text-gray-600">Card Privilege</label>
							{(!privileges || privileges.length === 0) ? (
								<p className="text-sm text-gray-500">No privileges available , cannot create card</p>
							) : (
								<select
									className={inputClass}
									value={selectedPrivilege?.privilegeCode}
									{...registerPrivilegeCode}
								>
									{privileges.map((item) => (
										<option key={item.privilegeCode} value={item.privilegeCode}>
											{item.privilegeCode}
										</option>
									))}
								</select>
							)}
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm text-gray-600">Expiration Date</label>
							<input
								type="date"
								className={inputClass}
								value={estimatedExpirationDate ?? "N/A"}
								readOnly
							/>
						</div>

						<div className="flex flex-col gap-1 ">
							<label className="text-sm text-gray-600">Annual Fee ($) / Year</label>
							<input
								type="text"
								className={inputClass}
								value={selectedPrivilege?.annualFee ?? "N/A"}
								readOnly
							/>
						</div>

						<div className="flex flex-col gap-1 ">
							<label className="text-sm text-gray-600">Cash Back Rate (%)</label>
							<input
								type="text"
								className={inputClass}
								value={selectedPrivilege?.cashbackRate ?? "N/A"}
								readOnly
							/>
						</div>

						<div className="flex flex-col gap-1 ">
							<label className="text-sm text-gray-600">Spending Limit (Daily)</label>
							<input
								type="text"
								className={inputClass}
								value={selectedPrivilege?.spendingLimitDaily ?? "N/A"}
								readOnly
							/>
						</div>

						<div className="flex flex-col gap-1 ">
							<label className="text-sm text-gray-600">Pin Code</label>
							<input
								type="password"
								className={inputClass}
								placeholder="Enter 6-digit pin code"
								{...register("pinCode")}
								maxLength={6}
							/>
						</div>

						<Button type="button" onClick={openCreateCardConfirmationModal} content="Add Card" />
					</form>

					<Modal
						isOpen={isCreateCardConfirmationModalOpen}
						onClose={closeCreateCardConfirmationModal}
						title="Confirm Card Creation"
					>
						{isPinCodeConfirmed ? (
							<div className="flex flex-col gap-4">
								<span>Pin code confirmed. Click confirm to create the card.</span>
								<Button
									type="submit"
									content="Confirm"
									form="create-card-form"
									disabled={isCreateCardSubmitting}
									className="w-1/2 self-center rounded-xl px-6 bg-blue-500 hover:bg-blue-600"
								/>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								<p className="mb-4">Please re-enter the pin code to confirm card creation.</p>
								{/* Use controlled state for confirmation input to avoid direct DOM reads and sessionStorage usage. */}
								<input
									type="password"
									className={inputClass}
									placeholder="Enter confirmation pin code"
									value={confirmPinCode}
									onChange={(event) => setConfirmPinCode(event.target.value)}
									maxLength={6}
								/>
								<div className="flex justify-end gap-4 mt-6">
									<Button
										onClick={closeCreateCardConfirmationModal}
										content="Cancel"
										className="rounded-xl px-6 bg-gray-300 hover:bg-gray-400"
									/>
									<Button
										onClick={handleConfirmPinCode}
										content="Confirm"
										className="rounded-xl px-6 bg-blue-500 hover:bg-blue-600"
									/>
								</div>
							</div>
						)}
					</Modal>
				</>
			)}
		</Card>
	);
};

export default CreateCardSection;
