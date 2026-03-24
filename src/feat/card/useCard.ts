import { useMutation, useQuery } from "@tanstack/react-query";
import { createCard, getCard, getCards } from "./card.service";

export const useCard = () => {

  const useCreateCard = useMutation({
    mutationKey: ["create-card"],
    mutationFn: (formData: FormData) => {
      return createCard(formData);
    },
  });

  const useGetCardQuery = useQuery({
    queryKey: ["my-card"],
    queryFn: () => getCard(),
  });
  
  const useGetCardsQuery = (page: number, limit: number) => useQuery({
    queryKey: ["cards", page, limit],
    queryFn: () => getCards(page, limit),
  });

  return{
    useGetCardQuery,
    useGetCardsQuery,
    useCreateCard
  }
}