import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import Modal from "../../../../../shared/component/Modal";
import PaginationBar from "../../../../../shared/component/PaginationBar";
import Transaction from "../../../../transaction/Transaction";
import CreateTransactionSection from "./CreateTransactionSection";
import NavBar from "../../../../../shared/component/NavBar";
import { useViewTransactionSection } from "../hook/useViewTransactionSection";
import Card from "../../../../../shared/component/Card";

const formatCreatedAt = (createdAt: string) => {
	const parsed = new Date(createdAt);
	if (Number.isNaN(parsed.getTime())) {
		return createdAt;
	}

	return parsed.toLocaleString();
};

const ViewTransactionSection = () => {
	const {
		tabs,
		activeTab,
		setActiveTab,
		accountNumber,
		setTransactionPage,
		filteredTransactions,
		transactionPage,
		totalPage,
		isTransactionsLoading,
		isTransactionsFetching,
		selectedTransactionDetail,
		isOpenTransactionDetailModal,
		openTransactionDetailModal,
		closeTransactionDetailModal,
	} = useViewTransactionSection();

	return (
		<div >
			<div className="mb-6 flex flex-wrap items-end gap-4">
				<NavBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
				<CreateTransactionSection />
			</div>

			<div className="mb-2 grid grid-cols-6 px-4 text-sm font-semibold text-blue-600">
				<span>Date</span>
				<span>Transaction ID</span>
				<span>Description</span>
				<span>Type</span>
				<span>Amount</span>
				<span>Action</span>
			</div>

			{(isTransactionsLoading || isTransactionsFetching) && <LoadingSpinner />}

			{!isTransactionsLoading && !isTransactionsFetching && filteredTransactions.length === 0 && (
				<p className="p-4 text-sm text-gray-500">No transactions available</p>
			)}

			{!isTransactionsLoading && !isTransactionsFetching && filteredTransactions.length > 0 && (
				<Card className="flex flex-col">
					{filteredTransactions.map((transaction) => {
						const isExpense = transaction.senderAccountNumber === accountNumber;
						const formattedAmount = `${isExpense ? "-" : "+"}${transaction.transferredAmount.toLocaleString()}`;

						return (
							<div
								key={transaction.id}
								className="grid grid-cols-6 items-center border-b border-gray-100 px-4 py-4 text-sm text-gray-700 last:border-b-0"
							>
								<span>{formatCreatedAt(transaction.createdAt)}</span>
								<span>{transaction.id}</span>
								<span>{transaction.description}</span>
								<span>{transaction.type}</span>
								<span className={`font-semibold ${isExpense ? "text-red-500" : "text-green-500"}`}>
									{formattedAmount}
								</span>
								<button
									type="button"
									onClick={() => openTransactionDetailModal(transaction)}
									className="justify-self-start font-medium text-blue-600 hover:underline"
								>
									View details
								</button>
							</div>
						);
					})}
				</Card>
			)}

			<Modal
				isOpen={isOpenTransactionDetailModal}
				onClose={closeTransactionDetailModal}
				title="Transaction Details"
			>
				<Transaction transaction={selectedTransactionDetail} accountNumber={accountNumber} />
			</Modal>

			<PaginationBar
				totalPage={totalPage}
				setPage={setTransactionPage}
				currentPage={transactionPage}
			/>
		</div>
	);
};

export default ViewTransactionSection;