import { useQuery } from "@tanstack/react-query";
import { getCard } from "./my.card.service";

export const useMyCard = () => {
  const useGetCardQuery = useQuery({
    queryKey: ["my-card"],
    queryFn: () => getCard(),
  });
  
  return{
    useGetCardQuery
  }
}