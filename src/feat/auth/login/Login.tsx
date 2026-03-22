import { Link } from "react-router-dom";
import { ROOT_API_URL } from "../../../shared/constant/constant";
import { useLogin } from "./useLogin";

const Login = () => {

  const {
    message,
    usernameRef,
    handleSubmit
  } = useLogin();

  return (
    <form id="login-form" action={`${ROOT_API_URL}/login`} method="POST" onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="username" ref={usernameRef}/>
      <input type="password" name="password" placeholder="password" />
      {message && <p style={{ color: "red" }}>{message}</p>}
      <button type="submit"> Login </button>
      <Link to="/">go to home</Link>
    </form> 
    
    )
};

export default Login;

