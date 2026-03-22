import { Link } from "react-router-dom";

import Mycard from "../../../card/Mycard";
import Card from "../../../../shared/component/Card";
import InfoItem from "../../../../shared/component/InfoItem";
import BarChar from "../../../../shared/component/BarChar";

const transactionData = [
    { description: "Grocery Store", amount: -50.25, date: "2024-06-01" },
    { description: "Salary", amount: 2000.00, date: "2024-06-01" },
    { description: "Electricity Bill", amount: -75.00, date: "2024-05-30" },
];


const balanceHistoryData = [
  { month: "2019", balance: 12000 },
  { month: "2020", balance: 9500 },
  { month: "2021", balance: 15000 },
  { month: "2022", balance: 11000 },
  { month: "2023", balance: 18500 },
  { month: "2024", balance: 22000 },
  { month: "2025", balance: 27000 },
];

const weeklySpendingData = [
  { day: "Mon", deposit: 100.5  , withdrawal: 50 },
  { day: "Tue", deposit: 0, withdrawal: 45 },
  { day: "Wed", deposit: 0, withdrawal: 20 },
  { day: "Thu", deposit: 0, withdrawal: 60 },
  { day: "Fri", deposit: 0, withdrawal: 25 },
  { day: "Sat", deposit: 0, withdrawal: 80 },
  { day: "Sun", deposit: 40, withdrawal: 0 },
];

const CustomerDashboardOverView = () => {
  return (
    <div className="grid grid-cols-12 gap-10 p-8 ">
      
      <Mycard className="col-span-6"  innerClassName="h-4/5" />

      <Card title="Recent Transactions" className="col-span-6" innerClassName="flex flex-col mb-6 bg-white">
        {transactionData.map((tx, index) => (
          <section key={index} className="flex items-start justify-between">
            <InfoItem title={tx.description} value={tx.date} />
            <span className={`text-base font-bold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
              {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)}
            </span>
          </section>
          
        ))}
          <Link to="/dashboard/transactions" className="self-end mt-4">
            View all transactions
          </Link>
      </Card>
      
      <Card title="Weekly Activities" className="col-span-12" innerClassName="bg-white">
        <BarChar
          period="week"
          data={weeklySpendingData}
          bars={[
            { dataKey: "withdrawal", name: "Withdraw", color: "#ef4444" },
            { dataKey: "deposit", name: "Deposit", color: "#3b82f6" },
          ]}
        />
      </Card>

      <Card title="Balance History" className="col-span-12" innerClassName="bg-white">
        <BarChar
          period="year"
          data={balanceHistoryData}
          bars={[
            { dataKey: "balance", name: "Balance", color: "#4C49ED" },
          ]}
        />
      </Card>

        
    </div>
  )
}

export default CustomerDashboardOverView;




