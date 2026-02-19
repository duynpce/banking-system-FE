import './App.css';
import Login from './auth/login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import CallBack from './auth/CallBack';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login/>}/> 
        <Route path="/callback" element={<CallBack/>}/>

      </Routes>
      
    </BrowserRouter>
  )
}

export default App;
