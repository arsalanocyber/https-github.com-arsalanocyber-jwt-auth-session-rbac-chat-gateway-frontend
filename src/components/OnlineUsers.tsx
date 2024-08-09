import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { generateRandomId } from "../utils/generateRandomId";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000", {
  query: { token: localStorage.getItem("accessToken") },
});

interface User {
  userId: string;
  name: string;
}

const OnlineUsers: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const userId = localStorage.getItem("userId");
  const roomId = generateRandomId();
  useEffect(() => {
    const handleOnlineUsers = (users: User[]) => {
      const uniqueUsers = users.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.userId === user.userId)
      );
      setOnlineUsers(uniqueUsers);
    };

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("getOnlineUsers");
    });

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("connect");
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket, onlineUsers]);

  //   console.log(onlineUsers);
  const navigate = useNavigate();
  const messageHandler = async (participantId: string) => {
    const obj = { sender: userId, receiver: participantId };
    console.log(roomId);
    const roomCreated = await axios.post(
      `http://localhost:3000/api/chat/create-room/${roomId}`,
      obj
    );

    if (roomCreated.data.existingRoomId) {
      navigate(`/chat/${roomCreated.data.existingRoomId}`);
    } else {
      navigate(`/chat/${roomId}`);
    }
  };
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="xl" mb={4}>
        Online Users
      </Text>
      <VStack w={"full"} align="start">
        {onlineUsers.map((user) => (
          <Flex w={"full"} justifyContent={"space-between"}>
            <Text key={user.userId}>{user.name}</Text>
            {user.userId !== userId && (
              <Button
                onClick={() => messageHandler(user.userId)}
                colorScheme="cyan"
              >
                Message
              </Button>
            )}
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default OnlineUsers;
