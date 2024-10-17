// services/chatService.ts
import { supabase } from '../lib/supabaseClient';

export const fetchMessages = async () => {
  const { data: messagesData, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  return { messagesData, error };
};

export const fetchEditCounts = async (messageIds: string[]) => {
  const editCounts: { [key: string]: number } = {};

  // Fetch branches for each message and count edits
  await Promise.all(
    messageIds.map(async (messageId) => {
      const { count, error } = await supabase
        .from('branches')
        .select('*', { count: 'exact' })
        .eq('original_message_id', messageId);

      if (!error) {
        editCounts[messageId] = count || 0;
      }
    })
  );

  return editCounts;
};

export const insertMessage = async (content: string, userId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ content, user_id: userId }]);
  return { data, error };
};

export const updateMessage = async (messageId: number, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ content })
    .eq('id', messageId);
  return { data, error };
};




// // services/chatService.ts
// import { supabase } from '../lib/supabaseClient';

// export const fetchMessages = async () => {
//   const { data: messagesData, error: messagesError } = await supabase
//     .from('messages')
//     .select('id, content, parent_id, created_at, user_id')
//     .order('created_at', { ascending: true });

//   return { messagesData, messagesError };
// };

// export const fetchBranches = async (messageId: number) => {
//   const { data, error } = await supabase
//     .from('branches')
//     .select('edited_content, created_at, original_message_id')
//     .eq('original_message_id', messageId)
//     .order('created_at', { ascending: true });

//   return { data, error };
// };

// export const insertMessage = async (newMessage: string, userId: string) => {
//   return supabase
//     .from('messages')
//     .insert([{ content: newMessage, user_id: userId }]);
// };

// export const insertBranch = async (messageId: number, content: string) => {
//   return supabase
//     .from('branches')
//     .insert({ original_message_id: messageId, edited_content: content });
// };

// export const updateMessage = async (messageId: number, newContent: string) => {
//   return supabase.from('messages').update({ content: newContent }).eq('id', messageId);
// };