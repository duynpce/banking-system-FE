import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { AccountType, createAccountRequestSchema, Gender, type CreateAccountRequest } from '../../account/account.type';
import {
  type UniqueDetail,
  checkUniqueField,
} from "./register.service";
import {
  handleChangeExistsForUniqueDetails,
  handleChangeValueForUniqueDetails,
} from "../../../shared/utils/util";
import { useCreateAccount } from "../../account/useAccount";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormCustom } from "../../../shared/hook/useFormCustom";

export const useRegister = () => {
  const navigate = useNavigate();
  

  //used to check existence of unique details and store their values
  const [uniqueDetails, setUniqueDetails] = useState<UniqueDetail>({
    username: { value: "", exists: false },
    email: { value: "", exists: false },
    phoneNumber: { value: "", exists: false },
    idCardNumber: { value: "", exists: false },
    taxIdNumber: { value: "", exists: false },
  });

  const [hasAnUniqueDetailExists, setHasAnUniqueDetailExists] = useState(false);
  
  const [accountType, setAccountType] = useState<AccountType>(AccountType.PERSONAL);

  const registerMutation = useCreateAccount();

  //use mutate to get built-in states like isPending, isSuccess, isError
  const uniqueFieldMutation = useMutation({
    mutationFn: ({ name, value }: { name: string; value: string }) =>
      checkUniqueField(name, value),
  });
  const { mutateAsync: mutateUniqueFieldAsync } = uniqueFieldMutation;

  const debouncedCheckUniqueField = useMemo(
    () =>
      _.debounce(async (name: string, value: string) => {
        let exists = false;
        try {
          exists = await mutateUniqueFieldAsync({ name, value });
        } catch (err) {
          console.error("Error checking unique field:", err);
        } finally {
          handleChangeExistsForUniqueDetails(setUniqueDetails, name, exists);
          setHasAnUniqueDetailExists(() => {
            //check if any unique detail exists by checking the updated uniqueDetails state with the new existence value for the current field
            const updatedUniqueDetails = {
              ...uniqueDetails,
              [name]: { value, exists },
            };
            return Object.values(updatedUniqueDetails).some(
              (detail) => detail.exists
            );
          });
        }
      }, 750),
      //ensure debounce function is only recreated when mutateUniqueFieldAsync changes
    [mutateUniqueFieldAsync, uniqueDetails]
  );

  //debounce useEffect to cancel any pending debounced calls when component unmounts or when mutateUniqueFieldAsync changes to prevent memory leaks and ensure we don't update state after unmounting
  useEffect(() => {
    return () => {
      debouncedCheckUniqueField.cancel();
    };
  }, [debouncedCheckUniqueField]);

  const {handleSmartSubmit, register, setValue} = useFormCustom<CreateAccountRequest>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      address: "",
      fullName: "",
      dateOfBirth: "",
      idCardNumber: "",
      gender: Gender.MALE,
      organizationName: "",
      taxIdNumber: "",
      governmentDepartment: "",
    },
    resolver: zodResolver(createAccountRequestSchema),
  });

  //on change of account type, reset all unique details and set the type field in the form to the selected account type
  useEffect(() => {
    setValue("type", accountType);
    setValue("fullName", "");
    setValue("dateOfBirth", "");
    setValue("idCardNumber", "");
    setValue("gender", Gender.MALE);
    setValue("organizationName", "");
    setValue("taxIdNumber", "");
    setValue("governmentDepartment", "");
    setUniqueDetails({
      ...uniqueDetails,
      idCardNumber: { value: "", exists: false },
      taxIdNumber: { value: "", exists: false },
    });
  }, [accountType]);

  const handleRegisterRequest = (createAccountRequest: CreateAccountRequest) => {

    registerMutation.mutate(
      { createAccountRequest},
      {
        onSuccess: () => {
          sessionStorage.setItem("username", createAccountRequest.username);
          navigate("/login");
        },
      }
    );
  };

  const handleChangeUniqueDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the value in uniqueDetails state
    handleChangeValueForUniqueDetails(setUniqueDetails, name, value);

    // Trigger the debounced function to check uniqueness
    debouncedCheckUniqueField(name, value);
  };

  return {
    accountType,
    setAccountType,
    uniqueDetails,
    handleSmartSubmit,
    handleRegisterRequest,
    handleChangeUniqueDetails,
    hasAnUniqueDetailExists,
    isRegisterPending: registerMutation.isPending,
    inputRegister: register,
  };
};

