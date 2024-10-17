// components/MessageInput.tsx
import { FaArrowUp } from 'react-icons/fa';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleUpdateMessage: () => void;
  loading: boolean;
  editMessageId: string | null;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, setNewMessage, handleSendMessage, handleUpdateMessage, loading, editMessageId }) => {
  return (
    <div className="p-4 bg-gray-900 flex items-center">
      <div className="flex w-full items-center bg-gray-800 rounded-full px-4 py-2">
        <input
          className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              editMessageId ? handleUpdateMessage() : handleSendMessage();
            }
          }}
          disabled={loading}
          placeholder={editMessageId ? 'Edit your message' : 'Message ChatGPT'}
        />
        <button className={`ml-3 text-white p-2 rounded-full ${loading ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-700'}`} onClick={editMessageId ? handleUpdateMessage : handleSendMessage} disabled={loading}>
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;