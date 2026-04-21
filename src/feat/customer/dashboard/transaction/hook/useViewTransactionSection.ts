import { useMemo, useState } from "react";
import { useGetAccountQuery } from "../../../../account/useAccount";
import { useGetTransactionsWithPagination } from "../../../../transaction/useTransaction";
import { TransactionGroup, type TransactionDto } from "../../../../transaction/transaction.type";

const TRANSACTION_LIMIT = 6;

const TABS = ["All Transactions", "Income", "Outcome"] as const;
export type TransactionTab = (typeof TABS)[number];

export const useViewTransactionSection = () => {
  const [activeTab, setActiveTab] = useState<TransactionTab>("All Transactions");
  const [transactionPage, setTransactionPage] = useState(1);

  const transactionGroup = useMemo(() => {
    if (activeTab === "Income") {
      return TransactionGroup.INCOME;
    }

    if (activeTab === "Outcome") {
      return TransactionGroup.OUTCOME;
    }

    return TransactionGroup.ALL;
  }, [activeTab]);

  const { data: account } = useGetAccountQuery();
  const accountNumber = account?.number ?? "";

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = useGetTransactionsWithPagination(transactionPage - 1, TRANSACTION_LIMIT, transactionGroup);

  const transactions = transactionsData?.data ?? [];
  const transactionsMetaData = transactionsData?.metaData;
  const totalPage = transactionsMetaData?.totalPages ?? 1;

  const filteredTransactions = transactions;

  const handleChangeTab = (tab: TransactionTab) => {
    setActiveTab(tab);
    setTransactionPage(1);
  };

  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState<TransactionDto | undefined>(undefined);
  const [isOpenTransactionDetailModal, setIsOpenTransactionDetailModal] = useState(false);

  const openTransactionDetailModal = (transaction: TransactionDto) => {
    setSelectedTransactionDetail(transaction);
    setIsOpenTransactionDetailModal(true);
  };

  const closeTransactionDetailModal = () => {
    setIsOpenTransactionDetailModal(false);
    setSelectedTransactionDetail(undefined);
  };

  return {
    tabs: TABS,
    activeTab,
    setActiveTab: handleChangeTab,
    accountNumber,
    transactionPage, 
    setTransactionPage,
    filteredTransactions,
    transactionsMetaData,
    totalPage,
    isTransactionsLoading,
    isTransactionsFetching,
    selectedTransactionDetail,
    isOpenTransactionDetailModal,
    openTransactionDetailModal,
    closeTransactionDetailModal,
  };
};
