import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type Props = {};

const Auth = (props: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };
  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 p-4">
        <CardHeader>
          <h1 className="text-lg">{isLogin ? "Login" : "Register"}</h1>
        </CardHeader>
        <CardContent>{isLogin ? <LoginForm /> : <RegisterForm />}</CardContent>
        <CardFooter>
          <Button
            onClick={toggleAuthMode}
            className="w-full cursor-pointer"
            variant={"link"}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Auth;
