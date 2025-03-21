"use client";
import { useRouter } from "next/navigation";
import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { handleErrorApi } from "@/lib/utils";
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const handleGoogleLogin = async (code: string) => {
      try {
        // const result = await authApiRequest.loginByGoogle(body);
        const result = await fetch(
          "http://localhost:8080/api/v1/auth/login-google",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: code }),
          }
        );
        const data = await result.json();
        localStorage.setItem("sessionToken", data.data.token);
        if (data.data.account_info.role === "admin") {
          await authApiRequest.auth({
            sessionToken: data.data.token,
          });
          toast({
            title: `Chào mừng đăng nhập ${data.data.account_info["user-name"]}`,
            duration: 2000,
            variant: "info",
          });
          setUser(data.data.account_info);
          router.push("/homePage");
        } else if (data.data.account_info.role === "user") {
          toast({
            title: `Thực tập sinh vui lòng sử dụng app`,
            duration: 2000,
            variant: "destructive",
          });
        } else {
          await authApiRequest.auth({
            sessionToken: data.data.token,
          });
          toast({
            title: `Chào mừng đăng nhập ${data.data.account_info["user-name"]}`,
            duration: 2000,
            variant: "info",
          });
          setUser(data.data.account_info);
          router.push("listCard");
        }
      } catch (error: any) {
        handleErrorApi({
          error,
          setError: form.setError,
        });
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("code", code);
    if (code) {
      handleGoogleLogin(code);
    }
  }, []);

  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.login(values);
      if (result.payload.data.account_info.role === "admin") {
        await authApiRequest.auth({
          sessionToken: result.payload.data.token,
        });
        toast({
          title: `Chào mừng đăng nhập ${result.payload.data.account_info["user-name"]}`,
          duration: 2000,
          variant: "info",
        });
        setUser(result.payload.data.account_info);
        router.push("/homePage");
      } else if (result.payload.data.account_info.role === "user") {
        toast({
          title: `Thực tập sinh vui lòng sử dụng app`,
          duration: 2000,
          variant: "destructive",
        });
      } else {
        await authApiRequest.auth({
          sessionToken: result.payload.data.token,
        });
        toast({
          title: `Chào mừng đăng nhập ${result.payload.data.account_info["user-name"]}`,
          duration: 2000,
          variant: "info",
        });
        setUser(result.payload.data.account_info);
        router.push("listCard");
      }
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
        style={{
          backgroundImage: "url('/images/party.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          objectFit: "cover",
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{
                p: 4,
                zIndex: 1,
                width: "100%",
                maxWidth: "600px",
                backgroundColor: "inherit",
                color: "white",
              }}
            >
              <Typography
                variant="h5"
                textAlign="center"
                color="textSecondary"
                mb={1}
                style={{ color: "white" }}
              >
                NEXTBEAN CENTER
              </Typography>
              <Stack>
                <Box>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                      noValidate
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                style={{ marginBottom: 14 }}
                                type="email"
                                {...field}
                                placeholder="Nhập email"
                              />
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
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                              <Input
                                style={{ marginBottom: 14 }}
                                type="password"
                                {...field}
                                placeholder="Nhập password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={loading}
                      >
                        Đăng nhập
                      </Button>
                    </form>
                  </Form>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default LoginForm;
