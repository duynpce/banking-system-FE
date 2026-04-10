import { CardType, CreateCardRequestSchema, type CardDto, type CreateCardRequest } from '../../../card/card.type';
import { useCreateCard, useGetCardsQuery } from '../../../card/useCard';
import { useFormCustom } from '../../../../shared/hook/useFormCustom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAccountQuery } from '../../../account/useAccount';
import { useEffect, useMemo, useState } from 'react';
import { useGetCardPrivilegesByAccountTypeAndCardTypeQuery } from '../../../card/useCardPrivilege';
import type { CardPrivilegeDto } from '../../../card/card.privilege.type';
import { toast } from 'react-toastify';
export const useCustomerDashboardCard = () => {
  
  const [cardPage, setCardPage] = useState(1);
  const CARD_LIMIT = 4;
  const {data:cardsData, isLoading: isCardsLoading, isFetching: isCardsFetching} = useGetCardsQuery(cardPage -1 , CARD_LIMIT);
  const cards = cardsData?.data ?? [];
  const cardsMetaData = cardsData?.metaData;

  const createCardMutation = useCreateCard()
  const account = useGetAccountQuery().data;
  const accountType = account?.type;

  const [cardType, setCardType] = useState<CardType>(CardType.CREDIT);
  
  const {data :privileges,isLoading:isPrivilegesLoading} = useGetCardPrivilegesByAccountTypeAndCardTypeQuery(accountType ?? "PERSONAL",cardType);

  const [previousPrivileges, setPreviousPrivileges] = useState<CardPrivilegeDto[] | undefined>(privileges);

  const [selectedPrivilege, setSelectedPrivilege] = useState<CardPrivilegeDto | undefined>(privileges?.[0]);

  const [selectedCardDetail, setSelectedCardDetail] = useState<CardDto | undefined>(undefined);

  const [isOpenCardDetailModal, setIsOpenCardDetailModal] = useState(false);

  const [isCreateCardConfirmationModalOpen, setIsCreateCardConfirmationModalOpen] = useState(false);
  
  const [isPinCodeConfirmed, setIsPinCodeConfirmed] = useState(false);


  if(privileges !== previousPrivileges){
    setPreviousPrivileges(privileges);
    setSelectedPrivilege(privileges?.[0]);
  }
  
  const estimatedExpirationDate = useMemo(() => {
    const expiryYears = selectedPrivilege?.expirationYears;
    const date = new Date();

    if(!expiryYears) return "";
    
    date.setFullYear(date.getFullYear() + expiryYears);
    return date.toISOString().split("T")[0];
  }, [selectedPrivilege]);

    const {handleSmartSubmit, register, setValue, getValues} = useFormCustom<CreateCardRequest>({
    defaultValues: {
      forAccountType: accountType,
      privilegeCode: selectedPrivilege?.privilegeCode ,
      type: cardType,
      pinCode: "",
      holder: "",
    },
    resolver : zodResolver(CreateCardRequestSchema),
  });

  // set account type when account is fetched
  useEffect(() => {
    setValue("forAccountType", accountType ?? "PERSONAL");
  }, [accountType, setValue])

  const closeCreateCardConfirmationModal = () => {
    setIsCreateCardConfirmationModalOpen(false);
    setIsPinCodeConfirmed(false);
    sessionStorage.removeItem("confirm-pin-code");
  }

  const openCardDetailModal = (card: CardDto) => {
    setSelectedCardDetail(card);
    setIsOpenCardDetailModal(true);
  }

  const closeCardDetailModal = () => {
    setIsOpenCardDetailModal(false);
    setSelectedCardDetail(undefined);
  }

  const handlerCreateCard = (CreateCardRequest: CreateCardRequest) => {
    closeCreateCardConfirmationModal();
    createCardMutation.mutate(CreateCardRequest);
  }

  const handleConfirmPinCode = () => {
    const confirmPinCode = (document.getElementById("confirm-pin-code-input") as HTMLInputElement).value;
    const originalPinCode = sessionStorage.getItem("confirm-pin-code");

    if(confirmPinCode === originalPinCode){
      sessionStorage.removeItem("confirm-pin-code");
      setIsPinCodeConfirmed(true);
    }
    else{
      toast.error("Pin code does not match. Please try again.");
    }
  }

  return {
    accountType,
    handleSmartSubmit,
    handlerCreateCard,
    register,
    getValues,
    setCardPage,
    cardsData,
    cards,
    cardsMetaData,
    cardType,
    isCardsLoading,
    isCardsFetching,
    privileges,
    isPrivilegesLoading,
    estimatedExpirationDate,
    selectedPrivilege,
    setSelectedPrivilege,
    setCardType,
    selectedCardDetail,
    isOpenCardDetailModal,
    openCardDetailModal,
    closeCardDetailModal,
    isCreateCardConfirmationModalOpen,
    setIsCreateCardConfirmationModalOpen,
    closeCreateCardConfirmationModal,
    handleConfirmPinCode,
    isPinCodeConfirmed,
    setIsPinCodeConfirmed
  }
}
