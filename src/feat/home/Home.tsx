import { Link, useNavigate } from "react-router-dom";
import ImgButton from "../../shared/component/ImgButton";

const DOMAINS = [
  {
    title: "Account",
    description: "Manage personal, business, and government bank accounts. View balances, account details, and account-level activity in one place.",
    icon: "🏦",
  },
  {
    title: "Card",
    description: "Issue and manage credit/debit cards tied to accounts. Supports card privileges, spending limits, cashback rates, and annual fees.",
    icon: "💳",
  },
  {
    title: "Transaction",
    description: "Track all money movements — deposits, withdrawals, and transfers — with full history, filtering, and pagination support.",
    icon: "💸",
  },
  {
    title: "Loan",
    description: "Apply for loans, manage repayment schedules, and handle fine policies for overdue payments with configurable domain rules.",
    icon: "📋",
  },
];

const TECH_STACK = [
  { label: "Frontend", value: "React + TypeScript + Vite + TailwindCSS + React Query", icon: "⚛️" },
  { label: "Backend", value: "Spring Boot (Java) — RESTful API layer", icon: "🍃" },
  { label: "Database", value: "PostgreSQL — relational storage for all banking data", icon: "🐘" },
  { label: "Security", value: "OAuth 2.0 — delegated auth via a dedicated OAuth2 authorization server", icon: "🔐" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">PD BANK</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/overview"> go to dashboard </Link>
            <Link
              to="login"
              className="px-4 py-2 rounded-md bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <ImgButton
              alt="profile"
              src="/src/assets/icon/profile.svg"
              className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-400 transition p-1"
              onClick={() => navigate("dashboard/accounts")}
              title="Go to My Account"
            />
          </div>
        </div>
      </nav>

      {/* Hero / Introduction */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">A Modern Banking System Simulation</h2>
        <p className="max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
          PD Bank is a full-stack mock banking platform built to demonstrate real-world financial system
          workflows — from account management and card issuance to loan processing and transaction
          history — secured with industry-standard OAuth 2.0 authentication.
        </p>
        <Link
          to="/register"
          className="inline-block mt-8 px-8 py-3 bg-white text-blue-600 font-bold rounded-full text-lg shadow hover:bg-blue-50 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Domain Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-2">Core Banking Domains</h3>
        <p className="text-center text-gray-500 mb-10">
          Everything you'd expect from a real banking platform, built end-to-end.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOMAINS.map((domain) => (
            <div
              key={domain.title}
              className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 hover:shadow-md transition"
            >
              <span className="text-4xl">{domain.icon}</span>
              <h4 className="text-lg font-bold text-blue-600">{domain.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{domain.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-2">Tech Stack & Security</h3>
          <p className="text-center text-gray-500 mb-10">
            Built with production-grade technologies across the full stack.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TECH_STACK.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-700">{item.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-blue-100 text-center py-4 text-sm">
        © 2026 PD Bank — Mock Banking System Project
      </footer>
    </div>
  );
};

export default Home;