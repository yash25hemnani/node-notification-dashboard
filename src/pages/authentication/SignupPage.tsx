import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import SignupForm from "./forms/SignupForm";

const SignupPage = () => {
  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Box className="flex flex-col items-center gap-6 w-full max-w-sm">
        
        {/* Heading */}
        <Box className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Get started with Notify
          </p>
        </Box>

        {/* Card */}
        <Card className="w-full">
          <CardContent className="space-y-4 pt-6">
            
            <SignupForm />

          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" type="submit" form="signup-form">
              Sign up
            </Button>

            <Box className="text-center text-sm text-muted-foreground">
              <p>
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </NavLink>
              </p>
            </Box>
          </CardFooter>
        </Card>

      </Box>
    </Box>
  );
};

export default SignupPage;