import "./App.css";
import Login from "./auth/login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import CallBack from "./auth/common/CallBack";
import Authorize from "./auth/common/Authorize";
import Register from "./auth/register/Register";
import OverView from "./customer/dashboard/OverView";
import Layout from "./customer/dashboard/Layout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/> 
        <Route path="/callback" element={<CallBack/>}/>
        <Route path="/authorize" element={<Authorize/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Layout/>}>
          <Route path="overview" element={<OverView/>} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App;
