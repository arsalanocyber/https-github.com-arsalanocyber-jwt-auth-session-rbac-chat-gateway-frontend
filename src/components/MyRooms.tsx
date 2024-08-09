import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
  readBy: string[];
}

interface Room {
  roomId: string;
  sender: string;
  receiver: string;
  messages: Message[];
}

const MyRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const userId = localStorage.getItem("userId") || "Unknown";
  const navigate = useNavigate();

  const getMyRooms = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chat/user/${userId}/rooms`
      );
      const fetchedRooms: Room[] = response.data;
      setRooms(fetchedRooms);

      // Calculate unread counts
      const counts = fetchedRooms.map((room) => {
        const unreadCount = room.messages.filter(
          (message) => !message.readBy.includes(userId)
        ).length;
        return { roomId: room.roomId, count: unreadCount };
      });

      // Set unread counts
      setUnreadCounts(
        counts.reduce(
          (acc, { roomId, count }) => ({ ...acc, [roomId]: count }),
          {}
        )
      );
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    getMyRooms();

    // Listen for roomUsers updates from the server
  }, []);

  const handleNavigate = async (roomId: string) => {
    const response = await axios.post(
      `http://localhost:3000/api/chat/update-read-by/${roomId}`,
      { userId }
    );
    if (response) {
      navigate(`/chat/${roomId}`);
    }
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        My Rooms
      </Text>
      {rooms.length === 0 ? (
        <Text>No rooms found</Text>
      ) : (
        rooms.map((room) => (
          <Box
            key={room.roomId}
            p={4}
            cursor={"pointer"}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            mb={4}
            width="400px"
            position="relative"
            bg="white"
            onClick={() => handleNavigate(room.roomId)}
            transition="0.3s"
            _hover={{ transform: "scale(1.02)" }}
          >
            <Flex justifyContent="space-between">
              <Box>
                <Text fontWeight="bold">{room.roomId}</Text>
                <Text>Sender: {room.sender}</Text>
                <Text>Receiver: {room.receiver}</Text>
              </Box>
            </Flex>
            <Badge
              colorScheme="red"
              fontSize="xs"
              position="absolute"
              top="5px"
              right="5px"
            >
              Unread Messages: {unreadCounts[room.roomId] || 0}
            </Badge>
          </Box>
        ))
      )}
    </Box>
  );
};

export default MyRooms;
