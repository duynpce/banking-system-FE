import "./App.css";
import Login from "./auth/login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import CallBack from "./auth/callback/CallBack";
import Authorize from "./auth/callback/Authorize";
import Register from "./auth/register/Register";
import CustomerDashboardLayOut from "./customer/dashboard/layout/CustomerDashboardLayOut";
import CustomerDashboardOverView from "./customer/dashboard/overview/CustomerDashboardOverView";
import CustomerDashboardTransaction from "./customer/dashboard/CustomerDashboardTransaction";
import CustomerDashboardAccount from "./customer/dashboard/account/CustomerDashboardAccount";
import CustomerDashboardCard from "./customer/dashboard/CustomerDashboardCard";
import CustomerDashboardLoan from "./customer/dashboard/CustomerDashboardLoan";
import ToastProvider from "./shared/config/ToastProvider.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientConfig } from "./shared/config/userQuery.config";

function App() {
  return (
    <QueryClientProvider client={queryClientConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/callback" element={<CallBack/>}/>
          <Route path="/authorize" element={<Authorize/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<CustomerDashboardLayOut/>}>
            <Route path="overview" element={<CustomerDashboardOverView/>} />
            <Route path="transactions" element={<CustomerDashboardTransaction/>} />
            <Route path="accounts" element={<CustomerDashboardAccount/>} />
            <Route path="cards" element={<CustomerDashboardCard/>} />
            <Route path="loans" element={<CustomerDashboardLoan/>} />
          </Route>
        </Routes>
        <ToastProvider />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
