import Card from "../../../../../shared/component/Card";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import Modal from "../../../../../shared/component/Modal";
import PaginationBar from "../../../../../shared/component/PaginationBar";
import Mycard from "../../../../card/Mycard";
import { useViewCardSection } from "../component/useViewCardSection";

const CARD_ICON_STYLES = [
	{ iconBg: "bg-blue-100", iconText: "text-blue-500" },
	{ iconBg: "bg-pink-100", iconText: "text-pink-500" },
	{ iconBg: "bg-yellow-100", iconText: "text-yellow-500" },
] as const;

const ViewCardSection = () => {
	const {
		setCardPage,
		cards,
		cardsMetaData,
		totalPage,
		isCardsLoading,
		isCardsFetching,
		selectedCardDetail,
		isOpenCardDetailModal,
		openCardDetailModal,
		closeCardDetailModal,
	} = useViewCardSection();

	return (
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
				<Mycard card={selectedCardDetail} />
			</Modal>

			<PaginationBar totalPage={totalPage} setPage={setCardPage} currentPageData={cardsMetaData?.currentPage} />
		</Card>
	);
};

export default ViewCardSection;
