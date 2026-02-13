import axios, { AxiosError, type AxiosResponse } from "axios";
import { useState } from "react";
import { type ResponseData } from "../../shared/ResponseData";
import { ROOT_API_URL } from "../../shared/Constant";
// import { AUTHORIZATION_BASIC_SECRET, CLIENT_ID, REDIRECT_URI, ROOT_API_URL, SCOPE_FULL } from '../../shared/Constant';


const Login: React.FC = () => {
  const [username, setUsername] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [message ,setMessage] = useState<string>('');

  interface LoginResponse extends ResponseData{
    accessToken: string
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {

      const res: AxiosResponse<LoginResponse> = await axios.post(`${ROOT_API_URL}/v1/auth/login`,{username , password}, {
        withCredentials :true ,
      });

      const accessToken:string = res.data.accessToken;
  
      if(accessToken){
        axios.defaults.headers.common['Authorization'] = 'Bearer ${accessToken}';
      }

      alert(res.data);

    } catch (err: unknown) {

      const error = err as AxiosError<LoginResponse>;
      setMessage( error.response?.data?.message || 'undefine error');

    }
  };

  // const authorzire = async(e:string) => {
  //   const scope:string = SCOPE_FULL;
  //   const response_type:string = 'code';
  //   const client_id:string = CLIENT_ID;
  //   const redirect_uri:string = REDIRECT_URI;

  //   const res = await axios.get(`${ROOT_API_URL}/oauth2/authorize`, {
  //     params:{
  //       scope,
  //       response_type,
  //       client_id,
  //       redirect_uri
  //     }
  //   })

  //   return await res
  // }

  return (
    <form id="login-form" onSubmit={handleLogin} >
      <input type="text" name="usename" placeholder="usename"
      onChange={(e) => setUsername(e.target.value)}
      />
      <input type="password" name="password" placeholder="password" 
      onChange={(e) => setPassword(e.target.value) 
      }/>
       {message && <p style={{ color: "red" }}>{message}</p>}
      <button type="submit"> Login </button>
    </form>
    )
};

export default Login;
