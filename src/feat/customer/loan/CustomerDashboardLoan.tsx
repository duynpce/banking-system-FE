import { useState } from "react";
import Card from "../../../shared/component/Card";
import InfoItem from "../../../shared/component/InfoItem";

type Tab = "Loans" | "Loan Fine";

type Loan = {
  id: string;
  loanMoney: number;
  leftToRepay: number;
  duration: string;
  interestRate: string;
  installment: string;
};

type LoanFine = {
  id: string;
  loanId: string;
  fineAmount: number;
  type: "Overdue" | "Early Payment";
};

// ── Mock data ───────────────────────────────────────────────────────────────
const loans: Loan[] = [
  { id: "01", loanMoney: 100000,  leftToRepay: 40500,   duration: "8 Months",  interestRate: "12%", installment: "$2,000 / month"  },
  { id: "02", loanMoney: 500000,  leftToRepay: 250000,  duration: "36 Months", interestRate: "10%", installment: "$8,000 / month"  },
  { id: "03", loanMoney: 900000,  leftToRepay: 40500,   duration: "12 Months", interestRate: "12%", installment: "$5,000 / month"  },
  { id: "04", loanMoney: 50000,   leftToRepay: 40500,   duration: "25 Months", interestRate: "5%",  installment: "$2,000 / month"  },
  { id: "05", loanMoney: 50000,   leftToRepay: 40500,   duration: "5 Months",  interestRate: "16%", installment: "$10,000 / month" },
  { id: "06", loanMoney: 80000,   leftToRepay: 25500,   duration: "14 Months", interestRate: "8%",  installment: "$2,000 / month"  },
  { id: "07", loanMoney: 12000,   leftToRepay: 5500,    duration: "9 Months",  interestRate: "13%", installment: "$500 / month"    },
  { id: "08", loanMoney: 160000,  leftToRepay: 100800,  duration: "3 Months",  interestRate: "12%", installment: "$900 / month"    },
];

const fines: LoanFine[] = [
  { id: "F01", loanId: "01", fineAmount: 500,  type: "Overdue"        },
  { id: "F02", loanId: "03", fineAmount: 1200, type: "Overdue"        },
  { id: "F03", loanId: "05", fineAmount: 300,  type: "Early Payment"  },
  { id: "F04", loanId: "07", fineAmount: 150,  type: "Early Payment"  },
];

const totalLoan     = loans.reduce((s, l) => s + l.loanMoney, 0);
const unpaidLoan    = loans.reduce((s, l) => s + l.leftToRepay, 0);
const overdatedLoan = loans.filter((l) => ["Overdue"].some(() => fines.find((f) => f.loanId === l.id && f.type === "Overdue"))).reduce((s, l) => s + l.leftToRepay, 0);
const loanFineTotal = fines.reduce((s, f) => s + f.fineAmount, 0);

const fmt = (n: number) => `$${n.toLocaleString()}`;

const statCards = [
  { label: "Total Loan",     value: fmt(totalLoan),     bg: "bg-blue-100",   text: "text-blue-500"  },
  { label: "Unpaid Loan",    value: fmt(unpaidLoan),    bg: "bg-yellow-100", text: "text-yellow-500" },
  { label: "Overdue Loan",   value: fmt(overdatedLoan), bg: "bg-pink-100",   text: "text-pink-500"  },
  { label: "Loan Fine",      value: fmt(loanFineTotal), bg: "bg-teal-100",   text: "text-teal-500"  },
];

const totalLeftToRepay    = loans.reduce((s, l) => s + l.leftToRepay, 0);
const totalLoanMoney      = loans.reduce((s, l) => s + l.loanMoney, 0);

const CustomerDashboardLoan = () => {
  const TOTAL_PAGES = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Loans");

  const TABS: Tab[] = ["Loans", "Loan Fine"];

  return (
    <div className="grid grid-cols-12 gap-10 p-8">

      {statCards.map((card) => (
        <Card
          key={card.label}
          title=""
          className="col-span-3"
          innerClassName="bg-white flex items-center gap-4"
        >
          <span className={`flex items-center justify-center w-14 h-14 rounded-full text-xl ${card.bg} ${card.text}`}>
            $
          </span>
          <InfoItem title={card.label} value={card.value} />
        </Card>
      ))}

      <Card title="Active Loans Overview" className="col-span-12" innerClassName="bg-white">

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

        {activeTab === "Loans" && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 text-blue-500 text-sm font-semibold mb-2 px-4">
              <span>ID</span>
              <span>Loan Money</span>
              <span>Left to Repay</span>
              <span>Duration</span>
              <span>Interest Rate</span>
              <span>Installment</span>
              <span>Repay</span>
            </div>

            {loans.map((loan) => (
              <div
                key={loan.id}
                className="grid grid-cols-7 items-center py-4 border-b border-gray-100 last:border-b-0 px-4 text-sm text-gray-700"
              >
                <span>{loan.id}.</span>
                <span>${loan.loanMoney.toLocaleString()}</span>
                <span>${loan.leftToRepay.toLocaleString()}</span>
                <span>{loan.duration}</span>
                <span>{loan.interestRate}</span>
                <span>{loan.installment}</span>
                <button className="w-fit rounded-full border border-blue-500 text-blue-600 px-5 py-1.5 text-sm hover:bg-blue-50 transition-colors">
                  Repay
                </button>
              </div>
            ))}

            <div className="grid grid-cols-7 items-center py-4 px-4 text-sm font-semibold text-red-500">
              <span>Total</span>
              <span>${totalLoanMoney.toLocaleString()}</span>
              <span>${totalLeftToRepay.toLocaleString()}</span>
              <span />
              <span />
              <span>${(50000).toLocaleString()} / month</span>
              <span />
            </div>
          </div>
        )}

        {activeTab === "Loan Fine" && (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 text-blue-500 text-sm font-semibold mb-2 px-4">
              <span>ID</span>
              <span>Loan ID</span>
              <span>Fine Amount</span>
              <span>Type</span>
            </div>

            {fines.map((fine) => (
              <div
                key={fine.id}
                className="grid grid-cols-4 items-center py-4 border-b border-gray-100 last:border-b-0 px-4 text-sm text-gray-700"
              >
                <span>{fine.id}</span>
                <span>{fine.loanId}</span>
                <span className="font-semibold text-red-500">${fine.fineAmount.toLocaleString()}</span>
                <span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      fine.type === "Overdue"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {fine.type}
                  </span>
                </span>
              </div>
            ))}

            <div className="grid grid-cols-4 items-center py-4 px-4 text-sm font-semibold text-red-500">
              <span>Total</span>
              <span />
              <span>${loanFineTotal.toLocaleString()}</span>
              <span />
            </div>
          </div>
        )}

         {/* temp will be grouped into a component later */}
        <nav className="flex justify-end items-center gap-2 mt-6">
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
        </nav>

      </Card>
    </div>
  );
};

export default CustomerDashboardLoan;
