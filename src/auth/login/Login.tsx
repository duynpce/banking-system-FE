import {     useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROOT_API_URL } from "../../shared/constant/constant";
import { getErrorMessage } from "./login.service";

const Login = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const savedUsername = sessionStorage.getItem("username");
    if (savedUsername && usernameRef.current) {
      usernameRef.current.value = savedUsername;
    }
  }, []);

  const message = getErrorMessage(searchParams.get("error"));

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    
    if (username) {
      sessionStorage.setItem("username", username);
    }
  };

  

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

