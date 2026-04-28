import apiClient from "@/api/apiClient";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { useAlertStore } from "@/stores/alertStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  signupFormSchema,
  type SignupFormValues,
} from "../schemas/signupForm.schema";
import { extractApiError } from "@/utils/extractApiError";
import { useAuthStore } from "@/stores/authStore";

const SignupForm = () => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const setAuth = useAuthStore((s) => s.setAuth)

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await apiClient.post("/auth/signup/", data);

      if (response.status === 201) {
        const data = response.data.data;
        console.log(data)
        console.log(response.data)
        
        if (data) {
          setAuth(data.access_token, data.user)
        }
        
        showAlert(
          "Signup successful",
          "Your account has been created",
          "success",
        );
      }
    } catch (error: any) {
      const { code, message } = extractApiError(error);

      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} id="signup-form">
      <FormInput
        name="username"
        label="Username"
        inputProps={{
          type: "text",
        }}
      />

      <FormInput
        name="email"
        label="Email"
        inputProps={{
          type: "email",
        }}
      />

      <FormInput
        name="password"
        label="Password"
        inputProps={{
          type: "password",
        }}
      />

      <FormInput
        name="confirmPassword"
        label="Confirm Password"
        inputProps={{
          type: "password",
        }}
      />
    </FormProvider>
  );
};

export default SignupForm;
