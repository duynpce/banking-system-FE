import Card from "../../shared/component/Card";
import InfoItem from "../../shared/component/InfoItem";
import type { TransactionDto } from "./transaction.type";

type TransactionProps = {
	transaction?: TransactionDto;
	accountNumber?: string;
};

const formatDateTime = (createdAt: string) => {
	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) {
		return createdAt;
	}

	return date.toLocaleString();
};

const Transaction = ({ transaction, accountNumber }: TransactionProps) => {
	if (!transaction) {
		return (
			<Card title="Transaction Details" innerClassName="bg-white">
				<p className="text-sm text-gray-500">No transaction data available</p>
			</Card>
		);
	}

	const isExpense = transaction.senderAccountNumber === accountNumber;
	const amountPrefix = isExpense ? "-" : "+";

	return (
		<Card title="Transaction Details" innerClassName="bg-white">
			<section className="grid grid-cols-2 gap-4">
				<InfoItem title="Transaction ID" value={String(transaction.id)} />
				<InfoItem title="Type" value={transaction.type} />
				<InfoItem title="Status" value={transaction.status} />
				<InfoItem title="Created at" value={formatDateTime(transaction.createdAt)} />
				<InfoItem title="Sender account" value={transaction.senderAccountNumber} />
				<InfoItem title="Receiver account" value={transaction.receiverAccountNumber} />
				<InfoItem title="Description" value={transaction.description} />
				<InfoItem title="Transferred amount" value={`${amountPrefix}${transaction.transferredAmount.toFixed(4)}`} />
				<InfoItem title="Posted balance" value={transaction.postedBalance.toFixed(4)} />
			</section>
		</Card>
	);
};

export default Transaction;
