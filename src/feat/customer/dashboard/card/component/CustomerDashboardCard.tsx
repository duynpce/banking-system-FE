import CreateCardSection from "./CreateCardSection";
import ViewCardSection from "./ViewCardSection";

const CustomerDashboardCard = () => {
  return (
    <div className="grid grid-cols-12 gap-10 p-8">
      <ViewCardSection />
      <CreateCardSection />

    </div>
  );
};

export default CustomerDashboardCard;
