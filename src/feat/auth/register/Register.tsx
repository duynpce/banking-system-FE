import { AccountType } from '../../account/account.type';
import { useRegister } from './useRegister';
import Card from '../../../shared/component/Card';

const Register = () => {
  const {
    accountType,
    setAccountType,
    uniqueDetails,
    handleSubmit,
    handleRegisterRequest,
    handleChangeUniqueDetails,
    hasAnUniqueDetailExists,
    isRegisterPending,
    inputRegister,
    onValidationError,
  } = useRegister(); 

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card title="" innerClassName="bg-white shadow-lg">
        <form onSubmit={handleSubmit((createAccountRequest) => handleRegisterRequest(createAccountRequest), onValidationError)} name="register-form" className="space-y-6">
          
          {/* Account Type Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Select Account Type</h3>
            <div className="flex gap-3 flex-wrap">
              <button 
                type="button"
                onClick={() => setAccountType(AccountType.PERSONAL)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  accountType === AccountType.PERSONAL 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Personal
              </button>

              <button 
                type="button"
                onClick={() => setAccountType(AccountType.BUSINESS)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  accountType === AccountType.BUSINESS 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Business
              </button>

              <button 
                type="button"
                onClick={() => setAccountType(AccountType.GOVERNMENT)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  accountType === AccountType.GOVERNMENT 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Government
              </button>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block">
              <span className="text-gray-700 font-medium">Username</span>
              <div className="h-5 mt-1">
                {uniqueDetails.username.value && (
                  <p className={`text-sm ${uniqueDetails.username.exists ? 'text-red-500' : 'text-green-500'}`}>
                    {uniqueDetails.username.exists ? 'Username already exists' : 'Username is available'}
                  </p>
                )}
              </div>
              <input
                {...inputRegister("username")}
                placeholder="Enter username"
                value={uniqueDetails.username.value}
                onChange={handleChangeUniqueDetails}
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
                {...inputRegister("password")}
                type="password"
                placeholder="Enter password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </label>
          </div>

          {/* Email */}
          <div>
            <label className="block">
              <span className="text-gray-700 font-medium">Email</span>
              <div className="h-5 mt-1">
                {uniqueDetails.email.value && (
                  <p className={`text-sm ${uniqueDetails.email.exists ? 'text-red-500' : 'text-green-500'}`}>
                    {uniqueDetails.email.exists ? 'Email already exists' : 'Email is available'}
                  </p>
                )}
              </div>
              <input
                {...inputRegister("email")}
                type="email"
                placeholder="Enter email"
                value={uniqueDetails.email.value}
                onChange={handleChangeUniqueDetails}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </label>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block">
              <span className="text-gray-700 font-medium">Phone Number</span>
              <div className="h-5 mt-1">
                {uniqueDetails.phoneNumber.value && (
                  <p className={`text-sm ${uniqueDetails.phoneNumber.exists ? 'text-red-500' : 'text-green-500'}`}>
                    {uniqueDetails.phoneNumber.exists ? 'Phone number already exists' : 'Phone number is available'}
                  </p>
                )}
              </div>
              <input
                {...inputRegister("phoneNumber")}
                placeholder="Enter phone number"
                value={uniqueDetails.phoneNumber.value}
                onChange={handleChangeUniqueDetails}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </label>
          </div>

          {/* Address */}
          <div>
            <label className="block">
              <span className="text-gray-700 font-medium">Address</span>
              <textarea
                {...inputRegister("address")}
                placeholder="Enter address"
                rows={3}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </label>
          </div>

          {/* Personal Account Fields */}
          {accountType === AccountType.PERSONAL && (
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <legend className="text-lg font-semibold text-gray-700 px-2">Personal Information</legend>
              
              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">Full Name</span>
                  <input
                    {...inputRegister("fullName")}
                    type="text"
                    placeholder="Enter full name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">Date of Birth</span>
                  <input
                    {...inputRegister("dateOfBirth")}
                    type="date"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">ID Card Number</span>
                  <div className="h-5 mt-1">
                    {uniqueDetails.idCardNumber.value && (
                      <p className={`text-sm ${uniqueDetails.idCardNumber.exists ? 'text-red-500' : 'text-green-500'}`}>
                        {uniqueDetails.idCardNumber.exists ? 'ID card number already exists' : 'ID card number is available'}
                      </p>
                    )}
                  </div>
                  <input
                    {...inputRegister("idCardNumber")}
                    type="text"
                    placeholder="Enter ID card number (9-12 digits)"
                    pattern="[0-9]{9,12}"
                    value={uniqueDetails.idCardNumber.value}
                    onChange={handleChangeUniqueDetails}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">Gender</span>
                  <select
                    {...inputRegister("gender")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </label>
              </div>
            </fieldset>
          )}

          {/* Business Account Fields */}
          {accountType === AccountType.BUSINESS && (
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <legend className="text-lg font-semibold text-gray-700 px-2">Business Information</legend>
              
              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">Organization Name</span>
                  <input
                    {...inputRegister("organizationName")}
                    type="text"
                    placeholder="Enter organization name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">Tax ID Number</span>
                  <div className="h-5 mt-1">
                    {uniqueDetails.taxIdNumber.value && (
                      <p className={`text-sm ${uniqueDetails.taxIdNumber.exists ? 'text-red-500' : 'text-green-500'}`}>
                        {uniqueDetails.taxIdNumber.exists ? 'Tax ID number already exists' : 'Tax ID number is available'}
                      </p>
                    )}
                  </div>
                  <input
                    {...inputRegister("taxIdNumber")}
                    type="text"
                    placeholder="Enter tax ID number"
                    value={uniqueDetails.taxIdNumber.value}
                    onChange={handleChangeUniqueDetails}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>
              </div>
            </fieldset>
          )}

          {/* Government Account Fields */}
          {accountType === AccountType.GOVERNMENT && (
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <legend className="text-lg font-semibold text-gray-700 px-2">Government Information</legend>
              
              <div>
                <label className="block">
                  <span className="text-gray-700 font-medium">Government Department</span>
                  <input
                    {...inputRegister("governmentDepartment")}
                    type="text"
                    placeholder="Enter government department"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </label>
              </div>
            </fieldset>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isRegisterPending || hasAnUniqueDetailExists}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isRegisterPending ? 'Registering...' : 'Register'}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Register;