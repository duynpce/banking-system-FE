import { useState } from "react";
import { AccountType } from '../../types/AccountType';
import handleChange from "../../utils/util";
import axios, { AxiosError } from "axios";
import { ROOT_API_URL } from "../../shared/Constant";

const Register = () => {
  const [checkUniqueDetail, setDetails] = useState({
    username: "",
    email: "",
    phoneNumber:"",
    idCardNumber: "",
    taxIdNumber:"",
  })
  const [accountType, setAccountType] = useState(AccountType.PERSONAL);

  const apiMap = {
    [AccountType.BUSINESS]: "business-accounts",
    [AccountType.PERSONAL]: "personal-accounts",
    [AccountType.GOVERNMENT]: "government-accounts",
  }  

  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();
    const api = apiMap[accountType];
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      console.log(data);
      const res = await axios.post(`${ROOT_API_URL}/v1/${api}`, data);
      alert(res.data); 
    } catch (err) {
      const error = err as AxiosError;
      alert(error.message);
    }
    
  }

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
    
    <input
      name="username"
      placeholder="Username"
      value={checkUniqueDetail.username}
      onChange={handleChange(setDetails)}
      required
    />

    <input
      type="password"
      name="password"
      placeholder="Password"
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={checkUniqueDetail.email}
      onChange={handleChange(setDetails)}
      required
    />

    <input
      name="phoneNumber"
      placeholder="Phone Number"
      value={checkUniqueDetail.phoneNumber}
      onChange={handleChange(setDetails)}
      required
    />

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
        

        <input
          type="text"
          id="idCardNumber"
          name="idCardNumber"
          placeholder="Id card number"
          pattern="[0-9]{9,12}"
          required
        />

        <select
          id="gender"
          name="gender"
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

        <input
          type="text"
          id="taxIdNumber"
          name="taxIdNumber"
          placeholder="Tax ID number"
          required
        />
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
  
    <button type="submit">register</button>
  </form>
  )
}



export default Register;  