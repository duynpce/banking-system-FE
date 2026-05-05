import { useState } from "react";
import Card from "../../../../../shared/component/Card";
import NavBar from "../../../../../shared/component/NavBar";
import ViewFineLoanSection from "./ViewFineLoanSection";
import ViewLoanSection from "./ViewLoanSection";

type Tab = "Loans" | "Loan Fine";

const TABS: readonly Tab[] = ["Loans", "Loan Fine"];

const CustomerDashboardLoan = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Loans");

  return (
    <div className="grid grid-cols-12 gap-10 p-8">
      <Card title="Active Loans Overview" className="col-span-12" innerClassName="bg-white">
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <NavBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === "Loans" && <ViewLoanSection />}
        {activeTab === "Loan Fine" && <ViewFineLoanSection />}
      </Card>
    </div>
  );
};

export default CustomerDashboardLoan;

