import { useState } from "react";
import {
  addCategory,
  updateCategory,
} from "@services/categoryService/categoryService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

export const useAddEditCategory = (onSuccess: () => void) => {
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleAddCategory = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await addCategory(formData);
      showToaster({ message: "Category Added Successfully", type: "success" });
      onSuccess();
    } catch (err) {
      showToaster({
        message: err.response?.data?.message || "Delete failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (categoryId: string, formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      // switch from patch() back to the above put()
      await updateCategory(categoryId, formData);
      showToaster({ message: "Category Updated Successfully", type: "success" });
      onSuccess();
    } catch (err) {
      showToaster({
        message: err.response?.data?.message || "Failed to update category",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleAddCategory, handleEditCategory, loading, error };
};
