import { AccountType } from '../../account/account.type';
import { useRegister } from './useRegister';


const Register = () => {
  const {
    accountType,
    setAccountType,
    uniqueDetails,
    handleSubmit,
    handleChangeUniqueDetails,
    isRegisterPending,
  } = useRegister();

  return (
    <form onSubmit={handleSubmit} name="register-form">
      <nav>
        <button 
          type="button"
          disabled={accountType === AccountType.PERSONAL} 
          onClick={() => setAccountType(AccountType.PERSONAL)}
        >
          Personal account
        </button>

        <button 
          type="button"
          disabled={accountType === AccountType.BUSINESS} 
          onClick={() => setAccountType(AccountType.BUSINESS)}
        >
          Business account
        </button>

        <button 
          type="button"
          disabled={accountType === AccountType.GOVERNMENT} 
          onClick={() => setAccountType(AccountType.GOVERNMENT)}
        >
          Government account
        </button>
    </nav>
    
    <label >
      {(uniqueDetails.username.exists && uniqueDetails.username.value) && <p style={{color : "red"}}>existed username</p>}
      {(!uniqueDetails.username.exists && uniqueDetails.username.value) && <p style={{color : "green"}}>available username</p>}
      <input
      name="username"
      placeholder="Username"
      value={uniqueDetails.username.value}
      onChange={handleChangeUniqueDetails}
      required
      />
    </label>

    <input
      type="password"
      name="password"
      placeholder="Password"
      required
    />

    <label>
      {(uniqueDetails.email.exists && uniqueDetails.email.value) && <p style={{color : "red"}}>existed email</p>}
      {(!uniqueDetails.email.exists && uniqueDetails.email.value) && <p style={{color : "green"}}>available email</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={uniqueDetails.email.value}
        onChange={handleChangeUniqueDetails}
        required
      />
    </label>

    <label>
      {(uniqueDetails.phoneNumber.exists && uniqueDetails.phoneNumber.value) && <p style={{color : "red"}}>existed phone number</p>}
      {(!uniqueDetails.phoneNumber.exists && uniqueDetails.phoneNumber.value) && <p style={{color : "green"}}>available phone number</p>}
      <input
        name="phoneNumber"
        placeholder="Phone Number"
        value={uniqueDetails.phoneNumber.value}
        onChange={handleChangeUniqueDetails}
        required
      />
    </label>

    <textarea
      name="address"
      placeholder="Address"
      required
    />

    {accountType === AccountType.PERSONAL && 
      <fieldset >
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Full name"
          required
        />

        <label > date of birth
          <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          aria-label="date of birth"
          required
          />
        </label>
        

        <label>
          {(uniqueDetails.idCardNumber.exists && uniqueDetails.idCardNumber.value) && <p style={{color : "red"}}>existed ID card number</p>}
          {(!uniqueDetails.idCardNumber.exists && uniqueDetails.idCardNumber.value) && <p style={{color : "green"}}>available ID card number</p>}
          <input
            type="text"
            id="idCardNumber"
            name="idCardNumber"
            placeholder="Id card number"
            pattern="[0-9]{9,12}"
            value={uniqueDetails.idCardNumber.value}
            onChange={handleChangeUniqueDetails}
            required
          />
        </label>

        <select
          id="gender"
          name="gender"
          aria-label="gender"
          required
        >
          <option value="">Chose gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
      </fieldset>
    }

    {accountType === AccountType.BUSINESS && 
      <fieldset>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          placeholder="Organization name"
          required
        />

        <label>
          {(uniqueDetails.taxIdNumber.exists && uniqueDetails.taxIdNumber.value) && <p style={{color : "red"}}>existed tax ID number</p>}
          {(!uniqueDetails.taxIdNumber.exists && uniqueDetails.taxIdNumber.value) && <p style={{color : "green"}}>available tax ID number</p>}
          <input
            type="text"
            id="taxIdNumber"
            name="taxIdNumber"
            placeholder="Tax ID number"
            value={uniqueDetails.taxIdNumber.value}
            onChange={handleChangeUniqueDetails}
            required
          />
        </label>
    </fieldset>
    }

    {accountType === AccountType.GOVERNMENT &&   
      <fieldset >
        <input
          type="text"
          id="governmentDepartment"
          name="governmentDepartment"
          placeholder="Government department"
          required
        />
      </fieldset>
    }
  
    <button type="submit" disabled={isRegisterPending}>register</button>
  </form>
  )
}



export default Register;  