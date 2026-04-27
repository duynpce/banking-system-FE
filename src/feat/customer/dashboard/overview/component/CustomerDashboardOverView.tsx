import { useState } from "react";

import Mycard from "../../../../card/Mycard";
import Card from "../../../../../shared/component/Card";
import SelectWithLabel from "../../../../../shared/component/SelectWithLabel";
import { useGetCardQuery } from "../../../../card/useCard";
import { TransactionReportType, type TransactionReportType as TransactionReportTypeValue } from "../../../../transaction/transaction.type";
import RecentTransaction from "./RecentTransaction";
import ViewDailyTransactionReport from "./ViewDailyTransactionReport";
import ViewMonthlyTransactionReport from "./ViewMonthlyTransactionReport";
import ViewWeeklyTransactionReport from "./ViewWeeklyTransactionReport";
import ViewYearlyTransactionReport from "./ViewYearlyTransactionReport";

const CustomerDashboardOverView = () => {
  const cardData = useGetCardQuery().data;
  const [reportType, setReportType] = useState<TransactionReportTypeValue>(TransactionReportType.WEEK);

  const renderReportByType = () => {
    if (reportType === TransactionReportType.DAY) {
      return <ViewDailyTransactionReport />;
    }

    if (reportType === TransactionReportType.MONTH) {
      return <ViewMonthlyTransactionReport />;
    }

    if (reportType === TransactionReportType.YEAR) {
      return <ViewYearlyTransactionReport />;
    }

    return <ViewWeeklyTransactionReport />;
  };

  return (
    <div className="grid grid-cols-12 gap-10 p-8 ">
      <Mycard card={cardData} title="My cards" className="col-span-6"  innerClassName="h-4/5" />

      <RecentTransaction />
      
      <Card title="Transaction Activities" className="col-span-12" innerClassName="bg-white">
        <SelectWithLabel
          label="Report type"
          blockClassName="mb-4 max-w-xs"
          data={Object.values(TransactionReportType)}
          value={reportType}
          onChange={(e) => setReportType(e.target.value as TransactionReportTypeValue)}
        />

        {renderReportByType()}
      </Card>
    </div>
  );
};

export default CustomerDashboardOverView;




