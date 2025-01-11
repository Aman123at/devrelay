"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { registerUser } from "@/apicalls/authApiCalls";
import { IAuthApiResponse } from "@/interfaces/interfaces";

const Register = () => {
  const router = useRouter()
  const { user, setUser } = useAuth();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showCnfPass, setShowCnfPass] = useState<boolean>(false);

  const { toast } = useToast();

  const [creds, setCreds] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    cnfPassword: "",
  });

  if (user) {
    router.replace("/");
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (creds.password !== creds.cnfPassword) {
      toast({
        variant: "destructive",
        title: "Password and Confirm Password is not matching.",
      });
      return;
    }

    const res: IAuthApiResponse = await registerUser({
      email: creds.email,
      password: creds.password,
      username: creds.username,
      fullname: creds.fullname,
    });
    if (!res.error) {
      setUser(res.user);
      router.replace("/");
    } else {
      toast({
        variant: "destructive",
        title: "Error in register",
        description: res.error,
      });
      return;
    }
  };

  return (
    <div className="bg-slate-700 flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <p className="text-center text-white text-3xl">DevRelay</p>
        <div className="dark flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Register here</CardTitle>
              {/* <CardDescription>
          Login with your Apple or Google account
        </CardDescription> */}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister}>
                <div className="grid gap-6">
                  {/* <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Login with Apple
              </Button>
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
            </div> */}
                  {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div> */}
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter Username"
                        required
                        value={creds.username}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCreds({
                            ...creds,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        type="text"
                        placeholder="Enter Full Name"
                        required
                        value={creds.fullname}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCreds({
                            ...creds,
                            fullname: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={creds.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCreds({
                            ...creds,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="flex items-center">
                        <Input
                          id="password"
                          type={showPass ? "text" : "password"}
                          required
                          value={creds.password}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCreds({
                              ...creds,
                              password: e.target.value,
                            })
                          }
                        />
                        {showPass ? (
                          <EyeOff
                            className="ml-2"
                            onClick={() => setShowPass(false)}
                          />
                        ) : (
                          <Eye
                            className="ml-2"
                            onClick={() => setShowPass(true)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cnfpassword">Confirm Password</Label>
                      <div className="flex items-center">
                        <Input
                          id="cnfpassword"
                          type={showCnfPass ? "text" : "password"}
                          required
                          value={creds.cnfPassword}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCreds({
                              ...creds,
                              cnfPassword: e.target.value,
                            })
                          }
                        />
                        {showCnfPass ? (
                          <EyeOff
                            className="ml-2"
                            onClick={() => setShowCnfPass(false)}
                          />
                        ) : (
                          <Eye
                            className="ml-2"
                            onClick={() => setShowCnfPass(true)}
                          />
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href={"/pages/auth/login"}
                      className="underline underline-offset-4"
                    >
                      Log In
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-white text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
