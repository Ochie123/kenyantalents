"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { Box, Button, Card, Checkbox, FormControlLabel, FormGroup, Grid, Stack, Typography, TextField, Alert } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { baselightTheme } from "@/utils/theme/DefaultColors";
import PageContainer from "@/app/(auth)/login/PageContainer";
import { Logo } from "@/components/Logo";
import { saveClaimsAction, saveTokenAction, saveUserTypeAction } from "@/Redux/features/auth/authSlice";
import MainProvider from "@/app/MainProvider";

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [isAlertVisible, setAlertVisible] = useState(false);
  
    useEffect(() => {
      document.title = 'Sign In - moderndecordiaries';
    }, []);
  
    const saveUserAuthDetails = (data) => {
      const { access } = data;
      localStorage.setItem('token', access);
      Cookies.set('token', access);
      const claims = jwtDecode(access);
      dispatch(saveTokenAction(access));
      dispatch(saveClaimsAction(claims));
      return access;
    };

  const fetchUserTypeAndRedirect = async (userId: any, token: any) => {
    try {
      const response = await axios.get(`https://api.moderndecordiaries.com/apis/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userType = response.data.user_type;
      dispatch(saveUserTypeAction(userType));
      router.push('/dashboard');
    } catch (error) {
      console.error("Error fetching user type:", error);
      setError("Failed to fetch user data. Please try again.");
      setAlertVisible(true);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await axios.post(`https://api.moderndecordiaries.com/apis/auth/login/`, values);
      const token = saveUserAuthDetails(response.data);
      const claims = jwtDecode(token);
      await fetchUserTypeAndRedirect(claims.user_id, token);
    } catch (error) {
      setError("Failed to login. Please check your credentials and try again.");
      setAlertVisible(true);
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <ThemeProvider theme={baselightTheme}>
     <MainProvider>
        <CssBaseline />
        <PageContainer title="Sign in to Dashboard" description="Dashboard">
          <Box
            sx={{
              position: "relative",
              "&:before": {
                content: '""',
                background: "radial-gradient(#ffffff, #ffffff, #ffffff)",
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
              sx={{ minHeight: "100vh" }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                lg={4}
                xl={3}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Card
                  elevation={9}
                  sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                    <Link href="/" passHref>
                      <Box component="a" sx={{ display: 'inline-block', cursor: 'pointer' }}>
                        <Logo />
                      </Box>
                    </Link>
                  </Box>
                  <Typography variant="h4" textAlign="center" mb={4}>
                    Sign In
                  </Typography>
                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                      <Form>
                        <Stack spacing={3}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                          />
                          <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                          />
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox size="small" />}
                                label="Remember me"
                              />
                            </FormGroup>
            
                          </Stack>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                          >
                            Sign In
                          </Button>
                        </Stack>
                      </Form>
                    )}
                  </Formik>
                  {isAlertVisible && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Box>
        </PageContainer>
        </MainProvider>
    </ThemeProvider>
  );
};

export default Login;