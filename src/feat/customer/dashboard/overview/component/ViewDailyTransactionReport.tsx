import BarChar from "../../../../../shared/component/BarChar";
import InputWithLabel from "../../../../../shared/component/InputWithLabel";
import LoadingSpinner from "../../../../../shared/component/LoadingSpinner";
import { useViewDailyTransactionReport } from "../hook/useViewDailyTransactionReport";

const reportBars = [
	{ dataKey: "incomeAmount", name: "Income", color: "#16a34a" },
	{ dataKey: "outcomeAmount", name: "Outcome", color: "#dc2626" },
	{ dataKey: "incomeTransferAmount", name: "Income Transfer", color: "#0ea5e9" },
	{ dataKey: "outcomeTransferAmount", name: "Outcome Transfer", color: "#f97316" },
	{ dataKey: "cashbackAmount", name: "Cashback", color: "#7c3aed" },
	{ dataKey: "paymentAmount", name: "Payment", color: "#d946ef" },
	{ dataKey: "depositAmount", name: "Deposit", color: "#2563eb" },
	{ dataKey: "withdrawalAmount", name: "Withdrawal", color: "#b91c1c" },
];

const ViewDailyTransactionReport = () => {
	const { query, setQuery, reports, isLoading, isFetching } = useViewDailyTransactionReport();

	const handleNumberChange = (name: "year" | "month" | "day", value: string) => {
		setQuery((prev) => ({
			...prev,
			[name]: Number(value),
		}));
	};

	return (
		<section>
			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
				<InputWithLabel
					label="Year"
					name="year"
					type="number"
					min={2000}
					value={query.year}
					onChange={(e) => handleNumberChange("year", e.target.value)}
				/>
				<InputWithLabel
					label="Month"
					name="month"
					type="number"
					min={1}
					max={12}
					value={query.month}
					onChange={(e) => handleNumberChange("month", e.target.value)}
				/>
				<InputWithLabel
					label="Day"
					name="day"
					type="number"
					min={1}
					max={31}
					value={query.day}
					onChange={(e) => handleNumberChange("day", e.target.value)}
				/>
			</div>

			{(isLoading || isFetching) && <LoadingSpinner />}

			{!isLoading && !isFetching && reports.length === 0 && (
				<p className="text-sm text-gray-500">No report data available</p>
			)}

			{!isLoading && !isFetching && reports.length > 0 && (
				<BarChar
					period="day"
					data={reports}
					bars={reportBars}
					xAxisDataKey="startDate"
				/>
			)}
		</section>
	);
};

export default ViewDailyTransactionReport;
