import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Box, Input, Button, VStack, Text, Flex } from "@chakra-ui/react";
import axios from "axios";

const socket = io("http://localhost:3000", {
  query: { token: localStorage.getItem("accessToken") },
});

interface Message {
  sender: string;
  message: string;
  timestamp: Date;
}

interface User {
  userId: string;
  name: string;
}

const Chat: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const userId = localStorage.getItem("userId") || "Unknown";
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  useEffect(() => {
    const handleOnlineUsers = (users: User[]) => {
      const uniqueUsers = users.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.userId === user.userId)
      );
      setOnlineUsers(uniqueUsers);
      setUserIds(uniqueUsers.map((user) => user.userId));
    };

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("getOnlineUsers");
    });

    socket.on("roomUsers", (roomUsers) => {
      setRoomUsers(roomUsers);
    });

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("connect");
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("roomUsers");
    };
  }, [socket]);

  const fetchUserNames = async (userIds: string[]) => {
    try {
      const userPromises = userIds.map((id) =>
        axios.get(`http://localhost:3000/api/auth/users/${id}`)
      );
      const responses = await Promise.all(userPromises);
      const userMap = responses.reduce((map, response) => {
        const user = response.data;
        map[user._id] = user.name; // Adjust according to your response format
        return map;
      }, {} as Record<string, string>);
      setUserNames(userMap);
    } catch (error) {
      console.error("Failed to fetch user names:", error);
    }
  };

  useEffect(() => {
    // Collect user IDs from messages and fetch names
    const userIds = messages.flatMap((msg) => [msg.sender]);
    fetchUserNames([...new Set(userIds)]);
  }, [messages, socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/messages/${roomId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    socket.emit("joinRoom", { roomId });

    socket.on("message", (messageData: Message) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off("message");
      socket.off("joinRoom");
    };
  }, [socket]);

  const sendMessage = () => {
    socket.emit("message", {
      roomId,
      sender: userId,
      message,
      readBy: roomUsers,
    });
    setMessage("");
  };

  return (
    <Box p={4} h="full" bg="gray.50">
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Chat Room: {roomId}
      </Text>
      <VStack spacing={4} align="stretch" mb={4} h="60vh" overflowY="scroll">
        {messages.map((msg, index) => (
          <Flex
            key={index}
            alignSelf={msg.sender === userId ? "flex-end" : "flex-start"}
            direction="column"
            maxWidth="60%"
          >
            <Box
              p={3}
              bg={msg.sender === userId ? "blue.500" : "gray.200"}
              color={msg.sender === userId ? "white" : "black"}
              borderRadius="md"
              boxShadow="md"
              mb={2}
            >
              <Text fontWeight="bold" mb={1}>
                {userNames[msg.sender] || msg.sender}
              </Text>
              <Text>{msg.message}</Text>
            </Box>
            <Text ml={1} fontSize="sm" color="gray.500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Text>
          </Flex>
        ))}
      </VStack>
      <Flex>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          mb={2}
          mr={2}
        />
        <Button onClick={sendMessage} colorScheme="blue">
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default Chat;
