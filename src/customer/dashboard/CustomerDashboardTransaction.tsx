import { useState } from "react";
import Card from "../../shared/component/Card";
import BarChar from "../../shared/component/BarChar";
import Mycard from "./shared/Mycard";
import type { cardData } from "./shared/Mycard";

const myCardData: cardData = {
  cardNumber: "3778 **** **** 1234",
  cardType: "Visa",
  expiryDate: "12/22",
  cardHolder: "Eddy Cusuma",
};

const expenseData = [
  { month: "Aug", amount: 4000 },
  { month: "Sep", amount: 5500 },
  { month: "Oct", amount: 4200 },
  { month: "Nov", amount: 3800 },
  { month: "Dec", amount: 12500 },
  { month: "Jan", amount: 6000 },
];

type Transaction = {
  description: string;
  id: string;
  type: string;
  card: string;
  date: string;
  amount: number;
};

const transactions: Transaction[] = [
  { description: "Spotify Subscription", id: "#12548796", type: "Shopping", card: "1234 ****", date: "28 Jan, 12.30 AM", amount: -2500 },
  { description: "Freepik Sales", id: "#12548796", type: "Transfer", card: "1234 ****", date: "25 Jan, 10.40 PM", amount: 750 },
  { description: "Mobile Service", id: "#12548796", type: "Service", card: "1234 ****", date: "20 Jan, 10.40 PM", amount: -150 },
  { description: "Wilson", id: "#12548796", type: "Transfer", card: "1234 ****", date: "15 Jan, 03.29 PM", amount: -1050 },
  { description: "Emilly", id: "#12548796", type: "Transfer", card: "1234 ****", date: "14 Jan, 10.40 PM", amount: 840 },
];

const TABS = ["All Transactions", "Income", "Expense"] as const;
type Tab = (typeof TABS)[number];

const TOTAL_PAGES = 4;

const CustomerDashboardTransaction = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All Transactions");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="grid grid-cols-12 gap-10 p-8">

      {/* Row 1 */}
      <Mycard data={myCardData} className="col-span-6" innerClassName="h-4/5" />

      <Card title="My Expense" className="col-span-6" innerClassName="bg-white h-4/5">
        <BarChar
          period="year"
          data={expenseData}
          bars={[{ dataKey: "amount", name: "Expense", color: "#16DBCC" }]}
        />
      </Card>

      {/* Row 2 */}
      <Card title="Recent Transactions" className="col-span-12" innerClassName="bg-white h-4/5">

        {/* Tab navbar */}
        <nav className="flex gap-8 border-b border-gray-200 mb-6">
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

        {/* Table header */}
        <div className="grid grid-cols-6 text-blue-600 text-sm font-semibold mb-2 px-4">
          <span>Description</span>
          <span>Transaction ID</span>
          <span>Type</span>
          <span>Card</span>
          <span>Date</span>
          <span>Amount</span>
        </div>

        {/* Transaction rows */}
        <section className="flex flex-col">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="grid grid-cols-6 items-center py-4 border-b border-gray-100 last:border-b-0 px-4 text-sm text-gray-700"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                    tx.amount > 0
                      ? "border-green-400 text-green-500"
                      : "border-red-400 text-red-500"
                  }`}
                >
                  {tx.amount > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19V5M19 12l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7-7 7 7" />
                    </svg>
                  )}
                </span>
                <span className="font-medium">{tx.description}</span>
              </div>
              <span>{tx.id}</span>
              <span>{tx.type}</span>
              <span>{tx.card}</span>
              <span>{tx.date}</span>
              <span className={`font-semibold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                {tx.amount > 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
              </span>
            </div>
          ))}
        </section>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            &lt; Previous
          </button>
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Next &gt;
          </button>
        </div>

      </Card>
    </div>
  );
};

export default CustomerDashboardTransaction;
