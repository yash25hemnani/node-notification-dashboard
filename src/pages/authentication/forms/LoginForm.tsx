import apiClient from "@/api/apiClient";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { useAlertStore } from "@/stores/alertStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginFormSchema,
  type LoginFormValues,
} from "../schemas/loginForm.schema";
import { extractApiError } from "@/utils/extractApiError";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate();
  
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await apiClient.post("/auth/login/", data);
      
      if (response.status === 200 || response.status === 201) {
        const data = response.data.data;
        setAuth(data.accessToken, data.user) 
        
        showAlert(
          "Login successful",
          "You have been successfully logged in.",
          "success",
        );

        navigate("/")
      }
    } catch (error: any) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} id="login-form">
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
    </FormProvider>
  );
};

export default LoginForm;
