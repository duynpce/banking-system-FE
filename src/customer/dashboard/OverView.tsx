import Card from "../../shared/component/Card";
import InfoItem from '../../shared/component/InfoItem';

//mock data
const data = {
  cardNumber: "**** **** **** 1234",
  cardType: "Visa",
  expiryDate: "12/24",
  cardHolder: "John Doe",
};


const OverView = () => {
  return (
    <div className="grid grid-cols-12 gap-10 p-8">
      
      <Card title="My cards" className="col-span-6 h-40" innerClassName=" h-full boder bg-[linear-gradient(107.38deg,_#4C49ED_2.61%,_#0A06F4_101.2%)] text-white">
        <section className="grid grid-cols-2 gap-2 h-full">
          <InfoItem title="Card number" value={data.cardNumber} />
          <InfoItem title="Card type" value={data.cardType} />
          <InfoItem title="Expiry date" value={data.expiryDate} />
          <InfoItem title="Card holder" value={data.cardHolder} />
        </section>
      </Card>
      <Card title="My accounts" className="col-span-6" innerClassName="bg-green-800"></Card>

    </div>
  )
}

export default OverView;




// background: linear-gradient(107.38deg, #4C49ED 2.61%, #0A06F4 101.2%);



