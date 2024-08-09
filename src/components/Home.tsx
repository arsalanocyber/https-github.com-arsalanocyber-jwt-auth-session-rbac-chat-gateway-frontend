import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OnlineUsers from "./OnlineUsers";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Box as="header" bg="teal.500" color="white" py={4}>
        <Container maxW="container.lg">
          <Heading size="lg">Nest Practice</Heading>
        </Container>
      </Box>

      <Box as="main" py={8}>
        <Container maxW="container.md">
          <Stack spacing={6} textAlign="center">
            <Heading>Welcome to the Homepage</Heading>
            <Text fontSize="lg">
              This is a simple homepage designed with Chakra UI. Explore the
              features and enjoy the experience!
            </Text>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate("/products")}
            >
              Check Products
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box>
        <OnlineUsers />
      </Box>
      <Box as="footer" bg="gray.800" color="white" py={4} textAlign="center">
        <Container maxW="container.lg">
          <Text>© 2024 Nest Practice. All rights reserved.</Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
