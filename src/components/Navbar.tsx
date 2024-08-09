// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { getUserDetails } from "../utils/getUserDetails";
import { getTokenRole } from "../utils/getTokenDetails";

const Navbar: React.FC = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");
  const token = localStorage.getItem("accessToken");
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  let role;
  if (token) {
    role = getTokenRole(token);
  }

  useEffect(() => {
    if (userId) {
      getUserDetails(userId).then((user) => {
        if (user) {
          setUserName(user.name); // Assuming user object has a name property
        }
      });
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setUserName(null);
    navigate("/login");
  };

  return (
    <Box bg={bg} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <Box>
            <a href="/">Home</a>
          </Box>
          {!userName && (
            <>
              <Box>
                <Link to="/login">Login</Link>
              </Box>
              <Box>
                <Link to="/signup">Signup</Link>
              </Box>
            </>
          )}
        </HStack>
        <Flex alignItems={"center"}>
          {userName && (
            <>
              <Box mr={4}>Welcome, {userName}</Box>
              {role && role === "admin" && (
                <Button>
                  <Link to="/adminpanel">Admin Panel</Link>
                </Button>
              )}

              <Button onClick={handleLogout} colorScheme="teal" ml={4}>
                Logout
              </Button>
            </>
          )}
          <Button onClick={toggleColorMode} ml={4}>
            Toggle {useColorModeValue("Dark", "Light")}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
