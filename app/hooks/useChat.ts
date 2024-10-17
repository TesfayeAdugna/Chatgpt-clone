// hooks/useChat.ts
import { useState, useEffect } from 'react';
import { fetchMessages, insertMessage, updateMessage, fetchEditCounts } from '../services/chatService';
import { getChatbotResponse } from '../services/openAIService';

export const useChat = () => {
  const [messages, setMessages] = useState<{ id: any; content: any; parent_id: any; created_at: any; user_id: any; }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [editCounts, setEditCounts] = useState<{ [key: string]: number }>({});

  const fetchAllMessages = async () => {
    const { messagesData } = await fetchMessages();
    if (messagesData) {
      setMessages(messagesData);

      // Fetch edit counts for each message
      const editCountsData = await fetchEditCounts(messagesData.map(msg => msg.id));
      setEditCounts(editCountsData); // Set edit counts based on the message IDs
    }
  };

  const getMessageById = (id: string) => {
    return messages.find((msg) => msg.id === id);
  };

  const handleSendMessage = async () => {
    if (newMessage) {
      setLoading(true);
      await insertMessage(newMessage, "550e8400-e29b-41d4-a716-446655440000");
      const chatbotResponse = await getChatbotResponse(newMessage);
      await insertMessage(chatbotResponse, "c9bf9e57-1685-4c89-bafb-ff5af830be8a");
      await fetchAllMessages();
      setNewMessage('');
      setLoading(false);
    }
  };

  const handleUpdateMessage = async () => {
    if (editMessageId && newMessage) {
      await updateMessage(editMessageId, newMessage);
      setEditMessageId(null);
      setNewMessage('');
      await fetchAllMessages();
    }
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  return {
    messages,
    newMessage,
    setNewMessage,
    editMessageId,
    setEditMessageId,
    handleSendMessage,
    handleUpdateMessage,
    loading,
    getMessageById,  // New function to get message by ID
    editCounts,      // Return the edit counts
  };
};































// // hooks/useChat.ts
// import { useState, useEffect } from 'react';
// import { fetchMessages, insertMessage, updateMessage } from '../services/chatService';
// import { getChatbotResponse } from '../services/openAIService';

// export const useChat = () => {
//   const [messages, setMessages] = useState<{ id: any; content: any; parent_id: any; created_at: any; user_id: any; }[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [editMessageId, setEditMessageId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchAllMessages = async () => {
//     const { messagesData } = await fetchMessages();
//     if (messagesData) {
//       setMessages(messagesData);
//     }
//   };

//   const getMessageById = (id: string) => {
//     return messages.find((msg) => msg.id === id);
//   };

//   const handleSendMessage = async () => {
//     if (newMessage) {
//       setLoading(true);
//       await insertMessage(newMessage, "550e8400-e29b-41d4-a716-446655440000");
//       const chatbotResponse = await getChatbotResponse(newMessage);
//       await insertMessage(chatbotResponse, "c9bf9e57-1685-4c89-bafb-ff5af830be8a");
//       await fetchAllMessages();
//       setNewMessage('');
//       setLoading(false);
//     }
//   };

//   const handleUpdateMessage = async () => {
//     if (editMessageId && newMessage) {
//       await updateMessage(editMessageId, newMessage);
//       setEditMessageId(null);
//       setNewMessage('');
//       await fetchAllMessages();
//     }
//   };

//   useEffect(() => {
//     fetchAllMessages();
//   }, []);

//   return {
//     messages,
//     newMessage,
//     setNewMessage,
//     editMessageId,
//     setEditMessageId,
//     handleSendMessage,
//     handleUpdateMessage,
//     loading,
//     getMessageById,  // New function to get message by ID
//   };
// };

