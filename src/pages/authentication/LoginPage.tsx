import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import LoginForm from "./forms/LoginForm";

const LoginPage = () => {
  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Box className="flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Heading OUTSIDE card */}
        <Box className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Notify
          </h1>
          <p className="text-sm text-muted-foreground">Login to continue</p>
        </Box>

        {/* Card */}
        <Card className="w-full">
          <CardContent className="space-y-4 pt-2">
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" form="login-form" className="w-full">Login</Button>
            <Box className="text-center text-sm text-muted-foreground">
              <p>
                Don’t have an account?{" "}
                <NavLink
                  to="/signup"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </NavLink>
              </p>
            </Box>
          </CardFooter>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
