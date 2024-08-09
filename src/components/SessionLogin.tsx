// src/components/Login.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
// import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";

// Define the schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Define the form values type
type LoginFormValues = {
  email: string;
  password: string;
};

const SessionLogin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>("");

  async function checkAuthStatus() {
    try {
      const response = await axios.get("http://localhost:3000/auth/status", {
        withCredentials: true,
      });
      setIsLoggedIn(response.data.isLoggedIn);
    } catch (error) {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const toast = useToast();
  //   const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        data,
        { withCredentials: true }
      );
      setUsername(response.data.user.name);
      toast({
        title: "Login successful.",
        description: "You have successfully logged in.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      checkAuthStatus();
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to complete login.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true }
      );
      toast({
        title: "Logout successful.",
        description: "You have successfully logged out.",
        status: "success",
        duration: 9000,
        colorScheme: "red",
        isClosable: true,
      });
      checkAuthStatus(); // Refresh login status after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box width="100%" maxWidth="400px" mx="auto" mt="100px">
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" placeholder="Email" {...register("email")} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
              Login
            </Button>
          </VStack>
        </form>
      ) : (
        <>
          <VStack>
            <Text fontSize={"xl"}>Welcome: {username}</Text>
            <Button onClick={logoutHandler}>Logout</Button>
          </VStack>
        </>
      )}
    </Box>
  );
};

export default SessionLogin;
