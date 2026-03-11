import "./App.css";
import Login from "./auth/login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import CallBack from "./auth/common/CallBack";
import Authorize from "./auth/common/Authorize";
import Register from "./auth/register/Register";
import CustomerDashboardLayOut from "./customer/dashboard/CustomerDashboardLayOut";
import CustomerDashboardOverView from "./customer/dashboard/CustomerDashboardOverView";
import CustomerDashboardTransaction from "./customer/dashboard/CustomerDashboardTransaction";
import CustomerDashboardAccount from "./customer/dashboard/CustomerDashboardAccount";
import CustomerDashboardCard from "./customer/dashboard/CustomerDashboardCard";
import CustomerDashboardLoan from "./customer/dashboard/CustomerDashboardLoan";
function App() {
  return (
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

    </BrowserRouter>
  )
}

export default App;
