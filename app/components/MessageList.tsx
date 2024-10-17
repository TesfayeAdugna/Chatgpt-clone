// components/MessageList.tsx
import { FaEdit } from 'react-icons/fa';

interface Message {
  id: string;
  user_id: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
  handleFetchBranchHistory: (id: string) => void;
  handleEditMessage: (id: string) => void;
  handlePreviousBranch: (id: string) => void;
  handleNextBranch: (id: string) => void;
  branchIndexes: { [key: string]: number };
  branchHistories: { [key: string]: string[] };
  editCounts: { [key: string]: number };
}

  const USER_ID = '550e8400-e29b-41d4-a716-446655440000';
  const CHATBOT_ID = 'c9bf9e57-1685-4c89-bafb-ff5af830be8a';

const MessageList: React.FC<MessageListProps> = ({
  messages,
  handleFetchBranchHistory,
  handleEditMessage,
  handlePreviousBranch,
  handleNextBranch,
  branchIndexes,
  branchHistories,
  editCounts,
}) => {
  return (
    <div className="flex-grow p-4 overflow-auto">
      {messages.map((msg) => (
        <div key={msg.id} className={`mb-4 flex ${msg.user_id === USER_ID ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex flex-col ${msg.user_id === USER_ID ? 'items-end' : 'items-start'}`}>
            <div className={`w-[70%] p-4 rounded-lg ${msg.user_id === USER_ID ? 'bg-gray-600 text-white' : 'text-white justify-start'}`}>
              <p className="text-lg">{msg.content}</p>
            </div>

            {msg.user_id === USER_ID && (
              <div className="mt-2 flex justify-end items-center space-x-2">
                <span className="text-gray-400">{editCounts[msg.id] || 0}</span> {/* Display correct edit count */}
                {editCounts[msg.id] >= 1 && (
                  <>
                    <button onClick={() => handlePreviousBranch(msg.id)} disabled={branchIndexes[msg.id] === 0} className="text-gray-400 hover:text-gray-200">
                      {'<'}
                    </button>
                    <button onClick={() => handleNextBranch(msg.id)} disabled={branchIndexes[msg.id] === (branchHistories[msg.id]?.length - 1)} className="text-gray-400 hover:text-gray-200">
                      {'>'}
                    </button>
                  </>
                )}
                <button onClick={() => handleEditMessage(msg.id)}>
                  <FaEdit className="text-gray-400 hover:text-gray-200" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

