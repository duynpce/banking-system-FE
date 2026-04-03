import { CreateCardRequestSchema, type CardDto, type CreateCardRequest } from '../../../card/card.type';
import { useCreateCard, useGetCardsQuery } from '../../../card/useCard';
import { useFormCustom } from '../../../../shared/hook/useFormCustom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAccountQuery } from '../../../account/useAccount';
import { useEffect, useState } from 'react';
export const useCustomerDashboardCard = () => {
  
  const [cardPage, setCardPage] = useState(1);
  const CARD_LIMIT = 4;
  const {data:cardsData, isLoading: isCardsLoading, isFetching: isCardsFetching} = useGetCardsQuery(cardPage -1 , CARD_LIMIT);
  const cards = cardsData?.data ?? [];
  const cardsMetaData = cardsData?.metaData;

  const createCardMutation = useCreateCard()
  const account = useGetAccountQuery().data;
  const accountType = account?.type;

  // mock data will fetch from backend later
  const mockPrivileges = ["Classic", "Gold", "Platinum"] as const;
  const mockAnnualFees = {
    "Classic": 500,
    "Gold": 1000,
    "Platinum": 2000,
  } as const;

  const mockExpirationDate =  {
    "gold" : 7,
    "platinum" :  10,
    "classic" : 5,
  }

  const {handleSmartSubmit, register, setValue} = useFormCustom<CreateCardRequest>({
    defaultValues: {
      forAccountType: accountType,
      privilegeCode: mockPrivileges[0],
      type: "CREDIT",
      pinCode: "",
      holder: "",
    },
    resolver : zodResolver(CreateCardRequestSchema),
  });

  // set account type when account is fetched
  useEffect(() => {
    setValue("forAccountType", accountType ?? "PERSONAL");
  }, [accountType, setValue])

  const handlerCreateCard = (CreateCardRequest: CreateCardRequest) => {
    createCardMutation.mutate(CreateCardRequest)
  }

  return {
    accountType,
    handleSmartSubmit,
    handlerCreateCard,
    register,
    setValue,
    setCardPage,
    cardsData,
    cards,
    cardsMetaData,
    isCardsLoading,
    isCardsFetching,
    mockAnnualFees,
    mockExpirationDate,
    mockPrivileges,
  }
}
