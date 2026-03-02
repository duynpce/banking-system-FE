import { useEffect, useMemo, useState } from "react";
import { AccountType } from '../../types/AccountType';
import { 
  type UniqueDetail, 
  handleRegister, 
  checkUniqueField 
} from './RegsiterService';
import _ from "lodash";
import { handleChangeExistsForUniqueDetails, handleChangeValueForUniqueDetails } from "../../utils/Util";


const Register = () => {

  // used to check existed information when register
  const [UniqueDetails, setUniqueDetails] = useState<UniqueDetail>({
    username:{value : "", exists:false},
    email: {value : "", exists:false},
    phoneNumber: {value : "", exists:false},
    idCardNumber: {value : "", exists:false},
    taxIdNumber: {value : "", exists:false}
  })
  const [accountType, setAccountType] = useState(AccountType.PERSONAL);

  const debouncedCheckUniqueField = useMemo(
    () => _.debounce(async (name: string, value: string) => {
      let exists = false;
      try {
        exists = await checkUniqueField(name, value);
      } catch (err) {
        console.error('Error checking unique field:', err);
      }finally{
        handleChangeExistsForUniqueDetails(setUniqueDetails, name ,exists);
      }
    }, 750),
    []
  );

  // Cleanup: cancel pending debounced calls on unmount
  useEffect(() => {
    return () => {
      debouncedCheckUniqueField.cancel();
    };
  }, [debouncedCheckUniqueField]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const message = await handleRegister(accountType, formData);
      alert(message); 
    } catch (err) {
      const error = err as Error;
      alert(error.message);
    }
  }

  const handleChangeUniqueDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Immediately update the input value (without exists check)
    handleChangeValueForUniqueDetails(setUniqueDetails, name, value);
    
    // Debounce the API call - waits 0.75 second after user stops typing
    debouncedCheckUniqueField(name, value);
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
    
    <label >
      {(UniqueDetails.username.exists && UniqueDetails.username.value) && <p style={{color : "red"}}>existed username</p>}
      {(!UniqueDetails.username.exists && UniqueDetails.username.value) && <p style={{color : "green"}}>available username</p>}
      <input
      name="username"
      placeholder="Username"
      value={UniqueDetails.username.value}
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
      {(UniqueDetails.email.exists && UniqueDetails.email.value) && <p style={{color : "red"}}>existed email</p>}
      {(!UniqueDetails.email.exists && UniqueDetails.email.value) && <p style={{color : "green"}}>available email</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={UniqueDetails.email.value}
        onChange={handleChangeUniqueDetails}
        required
      />
    </label>

    <label>
      {(UniqueDetails.phoneNumber.exists && UniqueDetails.phoneNumber.value) && <p style={{color : "red"}}>existed phone number</p>}
      {(!UniqueDetails.phoneNumber.exists && UniqueDetails.phoneNumber.value) && <p style={{color : "green"}}>available phone number</p>}
      <input
        name="phoneNumber"
        placeholder="Phone Number"
        value={UniqueDetails.phoneNumber.value}
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
          {(UniqueDetails.idCardNumber.exists && UniqueDetails.idCardNumber.value) && <p style={{color : "red"}}>existed ID card number</p>}
          {(!UniqueDetails.idCardNumber.exists && UniqueDetails.idCardNumber.value) && <p style={{color : "green"}}>available ID card number</p>}
          <input
            type="text"
            id="idCardNumber"
            name="idCardNumber"
            placeholder="Id card number"
            pattern="[0-9]{9,12}"
            value={UniqueDetails.idCardNumber.value}
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
          {(UniqueDetails.taxIdNumber.exists && UniqueDetails.taxIdNumber.value) && <p style={{color : "red"}}>existed tax ID number</p>}
          {(!UniqueDetails.taxIdNumber.exists && UniqueDetails.taxIdNumber.value) && <p style={{color : "green"}}>available tax ID number</p>}
          <input
            type="text"
            id="taxIdNumber"
            name="taxIdNumber"
            placeholder="Tax ID number"
            value={UniqueDetails.taxIdNumber.value}
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
  
    <button type="submit">register</button>
  </form>
  )
}



export default Register;  