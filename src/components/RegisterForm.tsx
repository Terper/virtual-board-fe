import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

type Props = {
  setIsLogin: (isLogin: boolean) => void;
};

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.username,
            password: data.password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Register data:", data);
    mutation.mutate(data, {
      onSuccess: (data) => {
        console.log("Registration successful:", data);
      },
    });
  };

  return (
    <Form {...form}>
      {mutation.isSuccess ? (
        <div className="space-y-4 text-center">
          <div className="text-green-600 font-semibold">
            Account created successfully!
          </div>
          <Button
            onClick={() => props.setIsLogin(true)}
            className="w-full cursor-pointer"
          >
            Go to Login
          </Button>
        </div>
      ) : (
        <>
          {mutation.isError && (
            <div className="text-red-600 text-center mb-2 font-semibold">
              An account could not be created.
            </div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={mutation.isPending}
            >
              Register
            </Button>
          </form>
        </>
      )}
    </Form>
  );
};

export default RegisterForm;
