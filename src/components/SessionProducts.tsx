import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
};

const SessionProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const toast = useToast();

  const getAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products", {
        withCredentials: true,
      });
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

  return (
    <>
      <Flex gap={4}>
        <Button onClick={getAllProducts} colorScheme="blue">
          Fetch Products
        </Button>
        {products.length > 0 &&
          products.map((product: Product) => (
            <Card maxW="sm" key={product._id}>
              <CardBody>
                <Stack mt="6" spacing="3">
                  <Heading size="md">{product.name}</Heading>
                  <Text>{product.description}</Text>
                  <Text color="blue.600" fontSize="2xl">
                    ${product.price}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button variant="solid" colorScheme="blue">
                    Buy now
                  </Button>
                  <Button variant="ghost" colorScheme="blue">
                    Add to cart
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
      </Flex>
    </>
  );
};

export default SessionProducts;
