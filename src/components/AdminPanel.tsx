import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
};

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const toast = useToast();

  const getAllProducts = async () => {
    const token = localStorage.getItem("accessToken");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        "http://localhost:3000/api/products",
        config
      );
      setProducts(response.data);
    } catch (error: any) {
      console.error("Error fetching products", error.message);
      toast({
        title: "Unauthorized",
        description: "You are not authorized to fetch the products.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Flex>
      {/* Sidebar */}
      <Box width="250px" color="white" p={4}>
        <Heading size="lg" mb={6}>
          Admin Panel
        </Heading>
        <Button colorScheme="teal" variant="solid" mb={4} width="100%">
          Dashboard
        </Button>
        <Button colorScheme="teal" variant="solid" mb={4} width="100%">
          Products
        </Button>
        <Button colorScheme="teal" variant="solid" mb={4} width="100%">
          Orders
        </Button>
        <Button colorScheme="teal" variant="solid" mb={4} width="100%">
          Users
        </Button>
      </Box>

      {/* Main content */}
      <Box flex="1" p={6}>
        <Flex justify="space-between" mb={6}>
          <Heading size="lg">Dashboard</Heading>
          <Button colorScheme="blue">Add New</Button>
        </Flex>
        <Divider mb={6} />

        {/* Sample Table */}
        <Container maxW="full" p={0}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>{item.description}</Td>
                  <Td>{item.price}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Container>
      </Box>
    </Flex>
  );
};

export default AdminPanel;
