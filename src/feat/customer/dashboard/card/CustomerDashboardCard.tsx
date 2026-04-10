import Button from "../../../../shared/component/Button";
import Card from "../../../../shared/component/Card";
import LoadingSpinner from "../../../../shared/component/LoadingSpinner";
import PaginationBar from "../../../../shared/component/PaginationBar";
import { useCustomerDashboardCard } from "./useCustomerDashBoardCard";
import { CardType } from "../../../card/card.type";
import Modal from "../../../../shared/component/Modal";
import Mycard from "../../../card/Mycard";

const CARD_ICON_STYLES = [
  { iconBg: "bg-blue-100", iconText: "text-blue-500" },
  { iconBg: "bg-pink-100", iconText: "text-pink-500" },
  { iconBg: "bg-yellow-100", iconText: "text-yellow-500" },
] as const;

const formatCardType = (cardType: string) => `${cardType[0]}${cardType.slice(1).toLowerCase()}`;

const CustomerDashboardCard = () => {
  const {
    accountType,
    handleSmartSubmit,
    handlerCreateCard,
    register,
    getValues,
    setCardPage,
    cards,
    cardsMetaData,
    isCardsLoading,
    isCardsFetching,
    setCardType,
    cardType,
    estimatedExpirationDate,
    selectedPrivilege,
    setSelectedPrivilege,
    selectedCardDetail,
    privileges,
    isPrivilegesLoading,
    isOpenCardDetailModal,
    openCardDetailModal,
    closeCardDetailModal,
    isCreateCardConfirmationModalOpen,
    setIsCreateCardConfirmationModalOpen,
    closeCreateCardConfirmationModal,
    handleConfirmPinCode,
    isPinCodeConfirmed,
  } = useCustomerDashboardCard();

  const totalPage = cardsMetaData?.totalPages ?? 1;

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none focus:ring-2 focus:ring-blue-300 bg-white";

  return (
    <div className="grid grid-cols-12 gap-10 p-8">
      <Card title="Card List" className="col-span-12" innerClassName="bg-white flex flex-col gap-4">
        {(isCardsLoading || isCardsFetching) && <LoadingSpinner />}

        {!isCardsLoading && !isCardsFetching && cards.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No card available</p>
        )}

        {!isCardsLoading && !isCardsFetching && cards.length > 0 && cards.map((card, index) => {
          const iconStyle = CARD_ICON_STYLES[index % CARD_ICON_STYLES.length];

          return (
            <div
              key={card.id}
              className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <span className={`flex items-center justify-center w-12 h-12 rounded-xl text-xl ${iconStyle.iconBg} ${iconStyle.iconText}`}>
                ☰
              </span>

              <div className="flex flex-col w-32">
                <span className="text-xs text-gray-400">Card Type</span>
                <span className="text-sm font-medium text-blue-500">{card.type}</span>
              </div>

              <div className="flex flex-col w-40">
                <span className="text-xs text-gray-400">Card Number</span>
                <span className="text-sm font-medium text-blue-500">{card.number}</span>
              </div>

              <div className="flex flex-col w-36">
                <span className="text-xs text-gray-400">Card Holder</span>
                <span className="text-sm font-medium text-blue-500">{card.holder}</span>
              </div>

              <div className="ml-auto flex items-center gap-4 text-sm font-medium text-blue-600">
                <button className="hover:underline" onClick={() => openCardDetailModal(card)}>
                  View Details
                </button>
              </div>
            </div>
          );
        })}

        <Modal
          isOpen={isOpenCardDetailModal}
          onClose={closeCardDetailModal}
          title="Card Details"
        >
          <Mycard card={selectedCardDetail}></Mycard>
        </Modal>
                
        <PaginationBar totalPage={totalPage} setPage={setCardPage} currentPageData={cardsMetaData?.currentPage}/>
      </Card>

      <Card title="Add New Card" className="col-span-12" innerClassName="bg-white">
        {isPrivilegesLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <form onSubmit={handleSmartSubmit((createCardRequest) => handlerCreateCard(createCardRequest))} className="grid grid-cols-2 gap-6" id="create-card-form">
              <input type="hidden" value={accountType ?? "PERSONAL"} {...register("forAccountType")} />
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Card Type</label>
                <select className={inputClass} defaultValue={cardType} {...register("type")}
                  onChange={(e) => {
                    setCardType(e.target.value as CardType);
                    setSelectedPrivilege(privileges?.[0]);
                  }}>
                  {Object.values(CardType).map((cardType) => (
                    <option key={cardType} value={cardType}>
                      {formatCardType(cardType)}
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
                </div>)
              }

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600" >Card Privilege</label>
                {(!privileges || privileges.length === 0) ? (
                  <p className="text-sm text-gray-500">No privileges available , cannot create card</p>
                ) :
                  (<select
                    className={inputClass}
                    value={selectedPrivilege?.privilegeCode}
                    {...register("privilegeCode", {
                    })}
                    onChange={(e) => setSelectedPrivilege(privileges?.find((p) => p.privilegeCode === e.target.value))}
                  >
                    {privileges?.map((p) => (
                      <option key={p.privilegeCode} value={p.privilegeCode}>
                        {p.privilegeCode}
                      </option>
                    ))}
                  </select>)
                }

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

              <Button type="button" onClick={() => {
                setIsCreateCardConfirmationModalOpen(true);
                sessionStorage.setItem("confirm-pin-code", getValues("pinCode"));
              }} content="Add Card" />
            </form>

            <Modal
              isOpen={isCreateCardConfirmationModalOpen}
              onClose={closeCreateCardConfirmationModal}
              title="Confirm Card Creation"
            >
              {isPinCodeConfirmed ?
                (
                  <div className="flex flex-col gap-4">
                    <span>Pin code confirmed. Click confirm to create the card.</span>
                    <Button type="submit" content="Confirm" form="create-card-form" className="w-1/2 self-center   rounded-xl px-6 bg-blue-500 hover:bg-blue-600" />
                  </div>

                ) :
                (
                  <div className="flex flex-col gap-4">
                    <p className="mb-4">Please re-enter the pin code to confirm card creation.</p>
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="Enter 6-digit pin code"
                      defaultValue=""
                      id="confirm-pin-code-input"
                      maxLength={6}
                    />
                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        onClick={closeCreateCardConfirmationModal}
                        content="Cancel" className="rounded-xl px-6 bg-gray-300 hover:bg-gray-400" />
                      <Button onClick={handleConfirmPinCode}
                        content="Confirm" className="rounded-xl px-6 bg-blue-500 hover:bg-blue-600" />
                    </div>
                  </div>
                )
              }
            </Modal>

          </>
        )}
      </Card>

    </div>
  );
};

export default CustomerDashboardCard;
