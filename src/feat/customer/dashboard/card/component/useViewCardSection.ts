import { useState } from "react";
import type { CardDto } from "../../../../card/card.type";
import { useGetCardsQuery } from "../../../../card/useCard";

export const useViewCardSection = () => {
	const [cardPage, setCardPage] = useState(1);
	const CARD_LIMIT = 4;

	const {
		data: cardsData,
		isLoading: isCardsLoading,
		isFetching: isCardsFetching,
	} = useGetCardsQuery(cardPage - 1, CARD_LIMIT);

	const cards = cardsData?.data ?? [];
	const cardsMetaData = cardsData?.metaData;
	const totalPage = cardsMetaData?.totalPages ?? 1;

	const [selectedCardDetail, setSelectedCardDetail] = useState<CardDto | undefined>(undefined);
	const [isOpenCardDetailModal, setIsOpenCardDetailModal] = useState(false);

	const openCardDetailModal = (card: CardDto) => {
		setSelectedCardDetail(card);
		setIsOpenCardDetailModal(true);
	};

	const closeCardDetailModal = () => {
		setIsOpenCardDetailModal(false);
		setSelectedCardDetail(undefined);
	};

	return {
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
	};
};
