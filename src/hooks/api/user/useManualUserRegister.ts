import { useState } from "react";
import { registerManualUser } from "@services/user/userService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export const useManualUserRegister = () => {
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = async (form: {
    name: string;
    email: string;
    number: string;
    province: string;
    city: string;
    userType: string;
    subscriptionAmount: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await registerManualUser({
        name: form.name,
        email: form.email,
        number: form.number,
        provinceId: form.province,
        cityId: form.city,
        userType: form.userType,
        subscriptionAmount: form.subscriptionAmount,
      });
      showToaster({ message: "User Added Successfully", type: "success" });
    } catch (err) {
      showToaster({
        message: err.response?.error?.data || "Registeration failed",
        type: "error",
      });
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
