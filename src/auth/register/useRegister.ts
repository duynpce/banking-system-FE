import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";
import { AccountType } from "../../types/account.type";
import {
  type UniqueDetail,
  checkUniqueField,
  handleRegister,
} from "./register.service";
import {
  handleChangeExistsForUniqueDetails,
  handleChangeValueForUniqueDetails,
} from "../../utils/util";

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

  const registerMutation = useMutation({
    mutationFn: ({
      currentAccountType,
      formData,
    }: {
      currentAccountType: AccountType;
      formData: FormData;
    }) => handleRegister(currentAccountType, formData),
  });

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
      { currentAccountType: accountType, formData },
      {
        onSuccess: (message) => {
          toast.success(message);
          navigate("/login");
        },
        onError: (error) => {
          const err = error as Error;
          toast.error(err.message);
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
