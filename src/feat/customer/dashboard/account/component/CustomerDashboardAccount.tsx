import { useState } from "react";
import Card from "../../../../../shared/component/Card";
import AccountProfile from "./AccountProfile";
import EditPasswordSection from "./EditPasswordSection";

type Tab = "Profile" | "Edit Password";

const TABS: Tab[] = ["Profile", "Edit Password"];

const CustomerDashboardAccount = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  return (
    <div className="grid grid-cols-12 gap-5 p-8">
      <Card className="col-span-12" innerClassName="bg-white rounded-3xl p-4" title="">
        <nav className="mb-6 flex gap-8 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-12 gap-5">
          {activeTab === "Profile" && <AccountProfile />}

          {activeTab === "Edit Password" && <EditPasswordSection />}
        </div>
      </Card>
    </div>
  );
};

export default CustomerDashboardAccount;