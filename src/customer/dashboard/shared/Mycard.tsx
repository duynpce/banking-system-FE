import { Link } from "react-router-dom";
import InfoItem from "../../../shared/component/InfoItem";
import Card from "../../../shared/component/Card";
import clsx from "clsx";

export interface cardData {
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  cardHolder: string;
}

interface MyCardProps  {
  data: cardData;
  className?: string;
  innerClassName?: string;
}

const Mycard = ({ data, className, innerClassName }: MyCardProps) => {

  return (
    <Card title="My cards" className={clsx(className)} innerClassName={clsx(innerClassName, "bg-[linear-gradient(107.38deg,_#4C49ED_2.61%,_#0A06F4_101.2%)] text-white")}>
        <section className="grid grid-cols-2 h-full">
          <InfoItem title="Card number" value={data.cardNumber} />
          <InfoItem title="Card type" value={data.cardType} />
          <InfoItem title="Expiry date" value={data.expiryDate} />
          <InfoItem title="Card holder" value={data.cardHolder} />
          <Link to="/dashboard/cards" >
            View all cards
          </Link>
        </section>
    </Card>
  );
}

export default Mycard;