import { Link } from "react-router-dom";

import clsx from "clsx";
import Card from "../../shared/component/Card";
import InfoItem from "../../shared/component/InfoItem";
import { useCard } from "./useCard";

interface MyCardProps  {
  className?: string;
  innerClassName?: string;
}


//my card component, display the first card of the user, if user has no card, display "No card data available"
const Mycard = ({ className, innerClassName }: MyCardProps) => {
  const {useGetCardQuery} = useCard();

  const card = useGetCardQuery.data;
  return (
    <Card title="My cards" className={clsx(className)} innerClassName={clsx(innerClassName, "bg-[linear-gradient(107.38deg,_#4C49ED_2.61%,_#0A06F4_101.2%)] text-white")}>
        <section className="grid grid-cols-2 h-full items-center">
          {card ? (
            <>
              <InfoItem title="Card Id" value={card.id} />
              <InfoItem title="Card number" value={card.cardNumber} />
              <InfoItem title="Card type" value={card.cardType} />
              <InfoItem title="Expiry date" value={card.expiryDate} />
              <InfoItem title="Card holder" value={card.cardHolder} />
              <InfoItem title="Privilege" value={card.privilege} />
              <Link to="/dashboard/cards" className="justify-self-start"> 
                View all cards
              </Link>
            </>
          ) : (
            <p className="col-span-2 text-white text-center">No card data available</p>
          )}
          
        </section>
    </Card>
  );
}

export default Mycard;