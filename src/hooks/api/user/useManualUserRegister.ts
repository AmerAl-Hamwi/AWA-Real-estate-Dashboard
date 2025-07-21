import { useState } from "react";
import { registerManualUser } from "@services/user/userService";
import { useToasterContext } from "@/contexts/toaster/useToasterContext";

export interface ManualUserPayload {
  name: string;
  email: string;
  number: string;
  province: string;
  city: string;
  userType: string;
  subscriptionAmount: string;
  image?: File;
}

export const useManualUserRegister = () => {
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const register = async (data: ManualUserPayload) => {
    setLoading(true);
    setError(null);
    try {
      await registerManualUser({
        name: data.name,
        email: data.email,
        number: data.number,
        provinceId: data.province,
        cityId: data.city,
        userType: data.userType,
        subscriptionAmount: data.subscriptionAmount,
        image: data.image,
      });
      showToaster({ message: "User added successfully", type: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      showToaster({ message: msg, type: "error" });
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
