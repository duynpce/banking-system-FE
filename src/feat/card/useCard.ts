import { useQuery } from "@tanstack/react-query";
import { getCard } from "./card.service";

export const useCard = () => {
  const useGetCardQuery = useQuery({
    queryKey: ["my-card"],
    queryFn: () => getCard(),
  });
  
  return{
    useGetCardQuery
  }
}