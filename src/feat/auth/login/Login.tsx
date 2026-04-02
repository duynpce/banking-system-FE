import { Link } from "react-router-dom";
import { ROOT_API_URL } from "../../../shared/constant/constant";
import { useLogin } from "./useLogin";
import Card from "../../../shared/component/Card";

const Login = () => {

  const {
    usernameRef,
    handleSubmit
  } = useLogin();

  return (
    <div className="max-w-md mx-auto p-4">
      <Card title="" innerClassName="bg-white shadow-lg">
        <form 
          id="login-form" 
          action={`${ROOT_API_URL}/login`} 
          method="POST" 
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
          </div>

          {/* Username */}
          <div>
            <label className="block">
              <span className="text-gray-700 font-medium">Username</span>
              <input 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                ref={usernameRef}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </label>
          </div>

          {/* Password */}
          <div>
            <label className="block">
              <span className="text-gray-700 font-medium">Password</span>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>

          {/* Link to Home */}
          <div className="text-center">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Go to home
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;

