import { Link } from "react-router"
import { api } from "../../config/axios/api"
import { toast } from "react-toastify"
import { useLogout } from "../auth/logout/useLogout";

// return 400 error --> to test error handling in api.ts
const onTestError = async() => {
  await api.get(`/v1/test/error`)
}

// return 200 success --> to test success handling in api.ts
const onTestSuccess = async () => {
  const res = await api.get<string>(`/v1/test/home`,{toastMessageWhenSuccess: "hello"})
  toast.success("API call successful: " + res)
    
}

const Home = () => {
  const useLogoutMutation = useLogout();

  const onTestLogout =  () => {
   useLogoutMutation.mutate();
  }
  
  return (
    <div>
       <p>this is home</p>
       <Link to="/login" >go to login</Link>
       <button onClick={onTestError}>test error</button>
       <button onClick={onTestSuccess}>test success</button>
       <button onClick={onTestLogout}>test logout</button>
    </div>
    
  )
} 

export default Home;