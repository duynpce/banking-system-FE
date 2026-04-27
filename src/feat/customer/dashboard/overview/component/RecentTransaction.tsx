import { Link } from "react-router-dom";
import Card from "../../../../../shared/component/Card";
import InfoItem from "../../../../../shared/component/InfoItem";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import { TransactionType, type TransactionDto } from "../../../../transaction/transaction.type";
import { useGetTransactionsWithPagination } from "../../../../transaction/useTransaction";

const getDisplayDate = (createdAt: string) => {
	const parsed = new Date(createdAt);
	if (Number.isNaN(parsed.getTime())) {
		return createdAt;
	}

	return parsed.toLocaleDateString();
};

const getAmountPrefix = (transaction: TransactionDto) => {
	if (transaction.type === TransactionType.DEPOSIT || transaction.type === TransactionType.CASHBACK) {
		return "+";
	}

	return "-";
};

const RecentTransaction = () => {
	const { data, isLoading, isFetching } = useGetTransactionsWithPagination(0, 3);
	const transactions = data?.data ?? [];

	return (
		<Card title="Recent Transactions" className="col-span-6" innerClassName="flex flex-col mb-6 bg-white">
			{(isLoading || isFetching) && <LoadingSpinner />}

			{!isLoading && !isFetching && transactions.length === 0 && (
				<p className="text-sm text-gray-500">No transactions available</p>
			)}

			{!isLoading && !isFetching && transactions.map((tx) => {
				const prefix = getAmountPrefix(tx);
				const isIncome = prefix === "+";

				return (
					<section key={tx.id} className="flex items-start justify-between">
						<InfoItem title={tx.description} value={getDisplayDate(tx.createdAt)} />
						<span className={`text-base font-bold ${isIncome ? "text-green-500" : "text-red-500"}`}>
							{`${prefix}${tx.transferredAmount.toFixed(4)}`}
						</span>
					</section>
				);
			})}

			<Link to="/dashboard/transactions" className="self-end mt-4">
				View all transactions
			</Link>
		</Card>
	);
};

export default RecentTransaction;
