import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { AccountType } from "../../account/account.type";
import {
  type UniqueDetail,
  checkUniqueField,
} from "./register.service";
import {
  handleChangeExistsForUniqueDetails,
  handleChangeValueForUniqueDetails,
} from "../../../shared/utils/util";
import { useCreateAccount } from "../../account/useAccount";

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
  const [accountType, setAccountType] = useState(AccountType.PERSONAL);

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
        }
      }, 750),
      //ensure debounce function is only recreated when mutateUniqueFieldAsync changes
    [mutateUniqueFieldAsync]
  );

  useEffect(() => {
    return () => {
      debouncedCheckUniqueField.cancel();
    };
  }, [debouncedCheckUniqueField]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    registerMutation.mutate(
      { formData, accountType },
      {
        onSuccess: () => {
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
    handleSubmit,
    handleChangeUniqueDetails,
    isRegisterPending: registerMutation.isPending,
  };
};
