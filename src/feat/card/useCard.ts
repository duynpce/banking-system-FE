import { useMutation, useQuery } from "@tanstack/react-query";
import { createCard, getCard, getCards } from "./card.service";

  export const useCreateCard = (formData: FormData) => {
   return useMutation({
    mutationKey: ["create-card"],
    mutationFn: () => createCard(formData),
   })
  }

  export const useGetCardQuery = () => {
    return useQuery({
      queryKey: ["my-card"],
      queryFn: () => getCard(),
    });
  };

  export const useGetCardsQuery = (page: number, limit: number) => {
    return useQuery({
      queryKey: ["cards", page, limit],
      queryFn: () => getCards(page, limit),
    });
  }  