import { Link } from "react-router-dom";

import clsx from "clsx";
import Card from "../../shared/component/Card";
import InfoItem from "../../shared/component/InfoItem";
import { useGetCardQuery } from "./useCard";

interface MyCardProps  {
  className?: string;
  innerClassName?: string;
}


//my card component, display the first card of the user, if user has no card, display "No card data available"
const Mycard = ({ className, innerClassName }: MyCardProps) => {
  const card = useGetCardQuery().data;
  return (
    <Card title="My cards" className={clsx(className)} innerClassName={clsx(innerClassName, "bg-[linear-gradient(107.38deg,_#4C49ED_2.61%,_#0A06F4_101.2%)] text-white")}>
        <section className="grid grid-cols-2 h-full items-center">
          {card ? (
            <>
              <InfoItem title="Card number" value={card.number} />
              <InfoItem title="Card type" value={card.type} />
              <InfoItem title="Expiry date" value={card.expirationDate} />
              <InfoItem title="Card holder" value={card.holder} />
              <InfoItem title="Privilege" value={card.privilege} />
              <InfoItem title="balance" value={card.balance.toFixed(4)} />
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