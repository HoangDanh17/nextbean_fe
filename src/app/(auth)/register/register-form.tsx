"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { handleErrorApi } from "@/lib/utils";
import authApiRequest from "@/apiRequests/auth";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await authApiRequest.register(values);

      await authApiRequest.auth({
        sessionToken: result.payload.data.token,
      });
     
      //   setUser(result.payload.data.account);

      router.push("/me");
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
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
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
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "600px" }}
            >
              <Typography
                variant="h5"
                textAlign="center"
                color="textSecondary"
                mb={1}
              >
                TẠO TÀI KHOẢN
              </Typography>
              <Stack>
                <Box>
                  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          style={{ marginBottom: 14 }}
                          {...field}
                          variant="outlined"
                          fullWidth
                          id="email"
                          label="Email"
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
                      )}
                    />
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          style={{ marginBottom: 14 }}
                          variant="outlined"
                          fullWidth
                          id="password"
                          label="Mật khẩu"
                          type="password"
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
                      )}
                    />
                    <Controller
                      name="confirmPassword"
                      control={form.control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          style={{ marginBottom: 14 }}
                          variant="outlined"
                          fullWidth
                          id="confirmPassword"
                          label="Xác nhận mật khẩu"
                          type="password"
                          error={!!error}
                          helperText={error ? error.message : null}
                        />
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
                      Tạo tài khoản
                    </Button>
                  </form>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                <Typography
                  component={Link}
                  href="/login"
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  Have an account ?
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default RegisterForm;
