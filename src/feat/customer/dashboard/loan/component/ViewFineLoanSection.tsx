import Card from "../../../../../shared/component/Card";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import PaginationBar from "../../../../../shared/component/PaginationBar";
import { LoanFineType } from "../../../../loan/domain/loan.fine.type";
import { useViewFineLoanSection } from "../hook/useViewFineLoanSection";

const ViewFineLoanSection = () => {
  const { page, setPage, fines, totalPage, isFinesLoading, isFinesFetching } =
    useViewFineLoanSection();

  return (
    <div>
      <div className="mb-2 grid grid-cols-4 px-4 text-sm font-semibold text-blue-600">
        <span>ID</span>
        <span>Loan ID</span>
        <span>Fine Amount</span>
        <span>Type</span>
      </div>

      {(isFinesLoading || isFinesFetching) && <LoadingSpinner />}

      {!isFinesLoading && !isFinesFetching && fines.length === 0 && (
        <p className="p-4 text-sm text-gray-500">No loan fines found.</p>
      )}

      {!isFinesLoading && !isFinesFetching && fines.length > 0 && (
        <Card className="flex flex-col" innerClassName="bg-white">
          {fines.map((fine) => (
            <div
              key={fine.id}
              className="grid grid-cols-4 items-center border-b border-gray-100 px-4 py-4 text-sm text-gray-700 last:border-b-0"
            >
              <span>{fine.id}</span>
              <span>{fine.loanId}</span>
              <span className="font-semibold text-red-500">
                ${fine.amount.toLocaleString()}
              </span>
              <span>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    fine.type === LoanFineType.OVERDUE_PAYMENT
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {fine.type === LoanFineType.OVERDUE_PAYMENT ? "Overdue" : "Early Payment"}
                </span>
              </span>
            </div>
          ))}
        </Card>
      )}

      <PaginationBar totalPage={totalPage} setPage={setPage} currentPage={page} />
    </div>
  );
};

export default ViewFineLoanSection;
