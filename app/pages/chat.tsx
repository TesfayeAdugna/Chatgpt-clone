// pages/chat.tsx
'use client';
import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const Chat = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    editMessageId,
    setEditMessageId,
    handleSendMessage,
    handleUpdateMessage,
    loading,
    getMessageById,  // Get the message by ID to edit
  } = useChat();

  return (
    <div className="flex h-screen">
      {/* Sidebar for conversation history */}
      <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto h-screen">
        <h2 className="text-lg font-bold">Conversation History</h2>
        <ul className="mt-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="p-2 cursor-pointer hover:bg-gray-700"
              onClick={() => {
                setEditMessageId(msg.id);  // Set the ID of the message to edit
                setNewMessage(msg.content);  // Populate input with the message content
              }}
            >
              {msg.content.slice(0, 20)}... {/* Show a snippet of the message */}
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat window */}
      <div className="w-3/4 bg-gray-800 text-white flex flex-col">
        <MessageList
          messages={messages}
          handleEditMessage={(id: string) => {
            setEditMessageId(Number(id));
            const message = getMessageById(id);
            setNewMessage(message?.content || '');  // Load the message content into the input field
          }}
          handleFetchBranchHistory={() => {}}
          handlePreviousBranch={() => {}}
          handleNextBranch={() => {}}
          branchIndexes={{}}
          branchHistories={{}}
          editCounts={{}}
        />
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleUpdateMessage={handleUpdateMessage}
          loading={loading}
          editMessageId={editMessageId ? editMessageId.toString() : null}
        />
      </div>
    </div>
  );
};

export default Chat;












































// 'use client';
// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { FaArrowUp, FaEdit } from 'react-icons/fa';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export default function Chat() {
//   interface Message {
//     id: number;
//     content: string;
//     parent_id: number | null;
//     created_at: string;
//     user_id: string;
//   }

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [editMessageId, setEditMessageId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [editCounts, setEditCounts] = useState<{ [key: number]: number }>({});
//   const [branchHistories, setBranchHistories] = useState<{ [key: number]: any[] }>({});
//   const [branchIndexes, setBranchIndexes] = useState<{ [key: number]: number }>({});

//   const USER_ID = '550e8400-e29b-41d4-a716-446655440000';
//   const CHATBOT_ID = 'c9bf9e57-1685-4c89-bafb-ff5af830be8a';

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     const { data: messagesData, error: messagesError } = await supabase
//       .from('messages')
//       .select('id, content, parent_id, created_at, user_id')
//       .order('created_at', { ascending: true });

//     if (!messagesError) {
//       setMessages(messagesData || []);
//       const editCountsData: { [key: number]: number } = {};

//       await Promise.all(
//         messagesData.map(async (msg) => {
//           const { count: branchCount } = await supabase
//             .from('branches')
//             .select('*', { count: 'exact' })
//             .eq('original_message_id', msg.id);
//           editCountsData[msg.id] = branchCount || 0;
//         })
//       );

//       setEditCounts(editCountsData);
//     }
//   };

//   const fetchBranchHistory = async (messageId: number) => {
//     const { data, error } = await supabase
//       .from('branches')
//       .select('edited_content, created_at, original_message_id')
//       .eq('original_message_id', messageId)
//       .order('created_at', { ascending: true });

//     if (!error) {
//       setBranchHistories((prev) => ({
//         ...prev,
//         [messageId]: data || [],
//       }));

//       setBranchIndexes((prev) => ({
//         ...prev,
//         [messageId]: 0,
//       }));

//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId && data.length > 0
//           ? { ...msg, content: data[0].edited_content }
//           : msg
//       );
//       setMessages(updatedMessages);
//     }
//   };

//   const handleNextBranch = (messageId: number) => {
//     const currentBranchIndex = branchIndexes[messageId] || 0;
//     const branches = branchHistories[messageId] || [];

//     if (currentBranchIndex < branches.length - 1) {
//       const nextIndex = currentBranchIndex + 1;
//       setBranchIndexes((prev) => ({
//         ...prev,
//         [messageId]: nextIndex,
//       }));

//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? { ...msg, content: branches[nextIndex].edited_content }
//           : msg
//       );
//       setMessages(updatedMessages);
//     }
//   };

//   const handlePreviousBranch = (messageId: number) => {
//     const currentBranchIndex = branchIndexes[messageId] || 0;
//     const branches = branchHistories[messageId] || [];

//     if (currentBranchIndex > 0) {
//       const prevIndex = currentBranchIndex - 1;
//       setBranchIndexes((prev) => ({
//         ...prev,
//         [messageId]: prevIndex,
//       }));

//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? { ...msg, content: branches[prevIndex].edited_content }
//           : msg
//       );
//       setMessages(updatedMessages);
//     }
//   };

//   const sendMessage = async () => {
//     if (newMessage) {
//       setLoading(true);

//       const { error: insertError } = await supabase
//         .from('messages')
//         .insert([{ content: newMessage, user_id: USER_ID }]);

//       if (!insertError) {
//         setNewMessage('');
//         await fetchMessages();

//         const chatbotResponse = await getChatbotResponse(newMessage);

//         const { error: chatbotInsertError } = await supabase
//           .from('messages')
//           .insert([{ content: chatbotResponse, user_id: CHATBOT_ID }]);

//         if (!chatbotInsertError) {
//           await fetchMessages();
//         }
//       }
//       setLoading(false);
//     }
//   };

//   const getChatbotResponse = async (userMessage: string) => {
//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: userMessage }],
//         max_tokens: 100,
//       });
//       return response.choices[0]?.message?.content?.trim() || 'No response';
//     } catch (error) {
//       return 'Sorry, there was an error generating the response.';
//     }
//   };

//   const handleEditMessage = async (messageId: number) => {
//     const messageToEdit = messages.find((msg) => msg.id === messageId);
//     if (messageToEdit) {
//       setNewMessage(messageToEdit.content);
//       setEditMessageId(messageId);
//     }
//   };

//   const updateMessage = async () => {
//     if (editMessageId && newMessage) {
//       const originalMessage = messages.find((msg) => msg.id === editMessageId);

//       if (originalMessage) {
//         await supabase
//           .from('branches')
//           .insert({
//             original_message_id: originalMessage.id,
//             edited_content: originalMessage.content,
//           });

//         await supabase
//           .from('messages')
//           .update({ content: newMessage })
//           .eq('id', editMessageId);

//         setEditCounts((prevCounts) => ({
//           ...prevCounts,
//           [editMessageId]: (prevCounts[editMessageId] || 0) + 1,
//         }));

//         setNewMessage('');
//         setEditMessageId(null);
//         await fetchMessages();
//       }
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto h-screen">
//         <h2 className="text-lg font-bold">Conversation History</h2>
//         <ul className="mt-4">
//           {messages.map((msg) => (
//             <li
//               key={msg.id}
//               className="p-2 cursor-pointer hover:bg-gray-700"
//               onClick={() => fetchBranchHistory(msg.id)}
//             >
//               {msg.content.slice(0, 20)}...
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Chat Window */}
//       <div className="w-3/4 bg-gray-800 text-white flex flex-col">
//         <div className="flex-grow p-4 overflow-auto">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`mb-4 flex ${
//                 msg.user_id === USER_ID ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div className={`flex flex-col ${msg.user_id === USER_ID ? 'items-end' : 'items-start'}`}>
//                 {/* Message bubble */}
//                 <div
//                   className={`w-[70%] p-4 rounded-lg ${
//                     msg.user_id === USER_ID
//                       ? 'bg-gray-600 text-white'
//                       : 'text-white justify-start'
//                   }`}
//                 >
//                   <p className="text-lg">{msg.content}</p>
//                 </div>

//                 {/* Branch navigation and edit icons */}
//                 {msg.user_id === USER_ID && (
//                   <div className="mt-2 flex justify-end items-center space-x-2">
//                     <span className="text-gray-400">
//                       {editCounts[msg.id] || 0}
//                     </span>
//                     {editCounts[msg.id] >= 1 && (
//                     <>
//                         <button
//                         onClick={() => handlePreviousBranch(msg.id)}
//                         disabled={branchIndexes[msg.id] === 0}
//                         className="text-gray-400 hover:text-gray-200"
//                         >
//                         {'<'}
//                         </button>
//                         <button
//                         onClick={() => handleNextBranch(msg.id)}
//                         disabled={branchIndexes[msg.id] === (branchHistories[msg.id]?.length - 1)}
//                         className="text-gray-400 hover:text-gray-200"
//                         >
//                         {'>'}
//                         </button>
//                     </>
//                     )}
//                     <button onClick={() => handleEditMessage(msg.id)}>
//                       <FaEdit className="text-gray-400 hover:text-gray-200" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         <div className="p-4 bg-gray-900 flex items-center">
//           <div className="flex w-full items-center bg-gray-800 rounded-full px-4 py-2">
//           <input
//             className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             placeholder={editMessageId ? 'Edit your message' : 'Message ChatGPT'}
//             onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                 editMessageId ? updateMessage() : sendMessage();
//                 }
//             }}
//             disabled={loading}
//             />
//             {/* <input
//               className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder={editMessageId ? 'Edit your message' : 'Message ChatGPT'}
//               disabled={loading}
//             /> */}
//             <button
//               className={`ml-3 text-white p-2 rounded-full ${
//                 loading ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700'
//               }`}
//               onClick={editMessageId ? updateMessage : sendMessage}
//               disabled={loading}
//             >
//               <FaArrowUp />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









































// 'use client';
// import { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { FaArrowUp, FaEdit } from 'react-icons/fa'; // Import the arrow and edit icons
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Your OpenAI API key
//   dangerouslyAllowBrowser: true,
// });

// export default function Chat() {
//   interface Message {
//     id: number;
//     content: string;
//     parent_id: number | null;
//     created_at: string;
//     user_id: string;
//   }

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [branchHistory, setBranchHistory] = useState<any[]>([]); // For storing branches
//   const [newMessage, setNewMessage] = useState('');
//   const [editMessageId, setEditMessageId] = useState<number | null>(null); // For editing
//   const [currentBranchIndex, setCurrentBranchIndex] = useState<number>(0); // Track branch index
//   const [loading, setLoading] = useState(false);
//   const [editCounts, setEditCounts] = useState<{ [key: number]: number }>({});

//   const USER_ID = '550e8400-e29b-41d4-a716-446655440000';
//   const CHATBOT_ID = 'c9bf9e57-1685-4c89-bafb-ff5af830be8a';

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     const { data: messagesData, error: messagesError } = await supabase
//       .from('messages')
//       .select('id, content, parent_id, created_at, user_id')
//       .order('created_at', { ascending: true });
  
//     if (messagesError) {
//       console.error('Error fetching messages:', messagesError);
//     } else {
//       setMessages(messagesData || []);
  
//       // Fetch edit counts for each message
//       const editCountsData: { [key: number]: number } = {};
  
//       await Promise.all(
//         messagesData.map(async (msg) => {
//           const { count: branchCount, error: branchError } = await supabase
//             .from('branches')
//             .select('*', { count: 'exact' })
//             .eq('original_message_id', msg.id);
  
//           if (!branchError) {
//             editCountsData[msg.id] = branchCount || 0;
//           }
//         })
//       );
  
//       setEditCounts(editCountsData); // Set the edit counts in the state
//     }
//   };

//   const fetchBranchHistory = async (messageId: number) => {
//     const { data, error } = await supabase
//       .from('branches')
//       .select('edited_content, created_at, original_message_id')
//       .eq('original_message_id', messageId)
//       .order('created_at', { ascending: true });
  
//     if (error) {
//       console.error('Error fetching branch history:', error);
//     } else {
//       setBranchHistory(data || []);
//       setCurrentBranchIndex(0);
  
//       // Update edit count for this specific message
//       setEditCounts((prevCounts) => ({
//         ...prevCounts,
//         [messageId]: data?.length || 0, // Store the number of edits
//       }));
  
//       const updatedMessages = messages.map((msg) =>
//         msg.id === messageId
//           ? { ...msg, content: data.length ? data[0].edited_content : msg.content }
//           : msg
//       );
//       setMessages(updatedMessages);
//     }
//   };

//   const handleNextBranch = () => {
//     if (currentBranchIndex < branchHistory.length - 1) {
//       const nextIndex = currentBranchIndex + 1;
//       setCurrentBranchIndex(nextIndex);
  
//       const updatedMessages = messages.map((msg) =>
//         msg.id === branchHistory[nextIndex].original_message_id
//           ? { ...msg, content: branchHistory[nextIndex].edited_content }
//           : msg
//       );
//       setMessages(updatedMessages);
//     }
//   };

// //   const handleNextBranch = () => {
// //     if (currentBranchIndex < branchHistory.length - 1) {
// //       const nextIndex = currentBranchIndex + 1;
// //       setCurrentBranchIndex(nextIndex);

// //       const updatedMessages = messages.map((msg) =>
// //         msg.id === branchHistory[nextIndex].original_message_id
// //           ? { ...msg, content: branchHistory[nextIndex].edited_content }
// //           : msg
// //       );
// //       setMessages(updatedMessages);
// //     }
// //   };

// const handlePreviousBranch = () => {
//     if (currentBranchIndex > 0) {
//       const prevIndex = currentBranchIndex - 1;
//       setCurrentBranchIndex(prevIndex);
  
//       const updatedMessages = messages.map((msg) =>
//         msg.id === branchHistory[prevIndex].original_message_id
//           ? { ...msg, content: branchHistory[prevIndex].edited_content }
//           : msg
//       );
//       setMessages(updatedMessages);
//     }
//   };

//   const sendMessage = async () => {
//     if (newMessage) {
//       setLoading(true);

//       const { error: insertError } = await supabase
//         .from('messages')
//         .insert([{ content: newMessage, user_id: USER_ID }]);

//       if (insertError) {
//         console.error('Error inserting message:', insertError);
//         setLoading(false);
//         return;
//       }

//       setNewMessage('');
//       await fetchMessages();

//       const chatbotResponse = await getChatbotResponse(newMessage);

//       const { error: chatbotInsertError } = await supabase
//         .from('messages')
//         .insert([{ content: chatbotResponse, user_id: CHATBOT_ID }]);

//       if (chatbotInsertError) {
//         console.error('Error inserting chatbot response:', chatbotInsertError);
//         setLoading(false);
//         return;
//       }

//       await fetchMessages();
//       setLoading(false);
//     }
//   };

//   const getChatbotResponse = async (userMessage: string) => {
//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: userMessage }],
//         max_tokens: 100,
//       });
//       return response.choices[0]?.message?.content?.trim() || 'No response';
//     } catch (error) {
//       console.error('Error fetching chatbot response:', error);
//       return 'Sorry, there was an error generating the response.';
//     }
//   };

//   const handleEditMessage = async (messageId: number) => {
//     const messageToEdit = messages.find((msg) => msg.id === messageId);
//     if (messageToEdit) {
//       setNewMessage(messageToEdit.content);
//       setEditMessageId(messageId);
//     }
//   };

//   const updateMessage = async () => {
//     if (editMessageId && newMessage) {
//       const originalMessage = messages.find((msg) => msg.id === editMessageId);
  
//       if (!originalMessage) {
//         console.error('Original message not found');
//         return;
//       }
  
//       const { error: branchInsertError } = await supabase
//         .from('branches')
//         .insert({
//           original_message_id: originalMessage.id,
//           edited_content: originalMessage.content,
//         });
  
//       if (branchInsertError) {
//         return;
//       }
  
//       const { error } = await supabase
//         .from('messages')
//         .update({ content: newMessage })
//         .eq('id', editMessageId);
  
//       if (error) {
//         return;
//       }
  
//       // Update the edit count for the edited message
//       setEditCounts((prevCounts) => ({
//         ...prevCounts,
//         [editMessageId]: (prevCounts[editMessageId] || 0) + 1, // Increment the edit count
//       }));
  
//       setNewMessage('');
//       setEditMessageId(null);
//       await fetchMessages();
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto h-screen">
//         <h2 className="text-lg font-bold">Conversation History</h2>
//         <ul className="mt-4">
//           {messages.map((msg) => (
//             <li
//               key={msg.id}
//               className="p-2 cursor-pointer hover:bg-gray-700"
//               onClick={() => fetchBranchHistory(msg.id)}
//             >
//               {msg.content.slice(0, 20)}...
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Main Chat Window */}
//       <div className="w-3/4 bg-gray-800 text-white flex flex-col">
//         <div className="flex-grow p-4 overflow-auto">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`mb-4 flex ${
//                 msg.user_id === USER_ID ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div className={`flex flex-col ${msg.user_id === USER_ID ? 'items-end' : 'items-start'}`}>
//                 {/* Message bubble */}
//                 <div
//                   className={`w-[70%] p-4 rounded-lg ${
//                     msg.user_id === USER_ID
//                       ? 'bg-gray-600 text-white'
//                       : 'text-white justify-start'
//                   }`}
//                 >
//                   <p className="text-lg">{msg.content}</p>
//                 </div>

//                 {/* Branch navigation and edit icons */}
//                 {msg.user_id === USER_ID && (
//                   <div className="mt-2 flex justify-end items-center space-x-2">
//                     <span className="text-gray-400">
//                       {editCounts[msg.id] || 0}
//                     </span>
//                     {editCounts[msg.id] >= 1 && (
//                     <>
//                         <button
//                         onClick={handlePreviousBranch}
//                         disabled={currentBranchIndex === 0}
//                         className="text-gray-400 hover:text-gray-200"
//                         >
//                         {'<'}
//                         </button>
//                         <button
//                         onClick={handleNextBranch}
//                         disabled={currentBranchIndex === branchHistory.length - 1}
//                         className="text-gray-400 hover:text-gray-200"
//                         >
//                         {'>'}
//                         </button>
//                     </>
//                     )}
//                     <button onClick={() => handleEditMessage(msg.id)}>
//                       <FaEdit className="text-gray-400 hover:text-gray-200" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         <div className="p-4 bg-gray-900 flex items-center">
//           <div className="flex w-full items-center bg-gray-800 rounded-full px-4 py-2">
//             <input
//               className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder={editMessageId ? 'Edit your message' : 'Message ChatGPT'}
//               disabled={loading}
//             />
//             <button
//               className={`ml-3 text-white p-2 rounded-full ${
//                 loading ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700'
//               }`}
//               onClick={editMessageId ? updateMessage : sendMessage}
//               disabled={loading}
//             >
//               <FaArrowUp />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }