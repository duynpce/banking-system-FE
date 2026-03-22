import { Link } from "react-router"
import { api } from "../../config/api"
import { toast } from "react-toastify"

// return 400 error --> to test error handling in api.ts
const onTestError = async() => {
  await api.get(`/v1/test/error`)
}

// return 200 success --> to test success handling in api.ts
const onTestSuccess = async () => {
  const res = await api.get<string>(`/v1/test/home`)
  toast.success("API call successful: " + res)
    
}

const Home = () => {
  return (
    <div>
       <p>this is home</p>
       <Link to="/login" >go to login</Link>
       <button onClick={onTestError}>test error</button>
       <button onClick={onTestSuccess}>test success</button>
    </div>
    
  )
} 

export default Home;