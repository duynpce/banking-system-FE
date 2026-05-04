import Card from "../../../../../shared/component/Card";
import ViewTransactionSection from "./ViewTransactionSection";

const CustomerDashboardTransaction = () => {
  return (
    <div className="grid grid-cols-12 gap-10 p-8">
      <Card title="Recent Transactions" className="col-span-12" innerClassName="bg-white h-4/5">
        <ViewTransactionSection />
      </Card>
    </div>
  );
};

export default CustomerDashboardTransaction;
