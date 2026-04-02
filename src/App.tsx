import "./App.css";
import Login from "./feat/auth/login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./feat/home/Home";
import CallBack from "./feat/auth/callback/CallBack";
import Authorize from "./feat/auth/callback/Authorize";
import Register from "./feat/auth/register/Register";
import CustomerDashboardLayOut from "./feat/customer/dashboard/layout/CustomerDashboardLayOut";
import CustomerDashboardOverView from "./feat/customer/dashboard/overview/CustomerDashboardOverView";
import CustomerDashboardTransaction from "./feat/customer/dashboard/CustomerDashboardTransaction";
import CustomerDashboardAccount from "./feat/customer/dashboard/account/CustomerDashboardAccount";
import CustomerDashboardCard from "./feat/customer/dashboard/card/CustomerDashboardCard";
import CustomerDashboardLoan from "./feat/customer/dashboard/CustomerDashboardLoan";
import ToastProvider from "./config/ToastProvider.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/userQuery.config";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
