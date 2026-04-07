import Button from "../../../../shared/component/Button";
import Card from "../../../../shared/component/Card";
import LoadingSpinner from "../../../../shared/component/LoadingSpinner";
import PaginationBar from "../../../../shared/component/PaginationBar";
import { useCustomerDashboardCard } from "./useCustomerDashBoardCard";
import { CardType } from "../../../card/card.type";
import { useMemo, useState } from "react";

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
    setCardPage,
    cards,
    cardsMetaData,
    isCardsLoading,
    isCardsFetching,
    mockAnnualFees,
    mockExpirationDate,
    mockPrivileges,
  } = useCustomerDashboardCard();

  const [selectedPrivilege, setSelectedPrivilege] = useState<(typeof mockPrivileges)[number]>(mockPrivileges[0]);

  const totalPage = cardsMetaData?.totalPages ?? 1;
  const annualFee = mockAnnualFees[selectedPrivilege];
  const estimatedExpiryDate = useMemo(() => {
    const expiryYears = mockExpirationDate[selectedPrivilege.toLowerCase() as keyof typeof mockExpirationDate];
    const date = new Date();
    date.setFullYear(date.getFullYear() + expiryYears);
    return date.toISOString().split("T")[0];
  }, [mockExpirationDate, selectedPrivilege]);

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
                <span className="text-sm font-medium text-blue-500">{formatCardType(card.type)}</span>
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
                <button className="hover:underline">View Details</button>
              </div>
            </div>
          );
        })}

        {totalPage > 1 && (
          <PaginationBar totalPage={totalPage} setPage={setCardPage} />
        )}
      </Card>

      <Card title="Add New Card" className="col-span-12" innerClassName="bg-white">
        <form onSubmit={handleSmartSubmit((createCardRequest) => handlerCreateCard(createCardRequest))} className="grid grid-cols-2 gap-6">
          <input type="hidden" value={accountType ?? "PERSONAL"} {...register("forAccountType")} />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Card Type</label>
            <select className={inputClass} defaultValue={CardType.CREDIT} {...register("type")}>
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
            /></div>)
            }

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Card Privilege</label>
            <select
              className={inputClass}
              defaultValue={mockPrivileges[0]}
              {...register("privilegeCode", {
                onChange: (event) => {
                  setSelectedPrivilege(event.target.value as (typeof mockPrivileges)[number]);
                },
              })}
            >
              {mockPrivileges.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Expiration Date</label>
            <input
              type="date"
              className={inputClass}
              value={estimatedExpiryDate}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1 ">
            <label className="text-sm text-gray-600">Annual Fee ($)</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              placeholder="0"
              value={annualFee}
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

          <Button type="submit" content="Add Card" className="rounded-xl px-8" />
        </form>
      </Card>
    </div>
  );
};

export default CustomerDashboardCard;