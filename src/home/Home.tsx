import { Link } from "react-router"

const Home = () => {
  return (
    <div>
       <p>this is home</p>
       <Link to="/login" >go to login</Link>
    </div>
    
  )
} 

export default Home;