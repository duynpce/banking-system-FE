import { useMutation, useQuery } from "@tanstack/react-query";
import { createCard, getCard, getCards } from "./card.service";
import type { CreateCardRequest } from './card.type';

  export const useCreateCard = (createCardRequest: CreateCardRequest) => {
   return useMutation({
    mutationKey: ["create-card"],
    mutationFn: () => createCard(createCardRequest),
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