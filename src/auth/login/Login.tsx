import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { handleLogin } from "./LoginService";
import { Link } from "react-router-dom";
import { ROOT_API_URL } from "../../shared/Constant";


const Login = () => {
  const [message, setMessage] = useState<string>('');

  return (
    <form id="login-form" action={`${ROOT_API_URL}/login`} method="POST"  >
      <input type="text" name="username" placeholder="username"
      />
      <input type="password" name="password" placeholder="password" />
       {message && <p style={{ color: "red" }}>{message}</p>}
      <button type="submit"> Login </button>
      <Link to="/">go to home</Link>
    </form> 
    
    )
};

export default Login;
