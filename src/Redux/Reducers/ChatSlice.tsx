import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Participant {
  id: number;
  username: string;
  user_type?: 'brand' | 'creator' | 'superuser';
}

interface Room {
  id: number;
  participants: Participant[];
}

interface Message {
  id: number;
  room: Room;
  sender: Participant;
  message: string;
  timestamp: string;
  is_read: boolean;
}

interface ChatSliceType {
  messages: Message[];
  currentUser: Participant | null;
  selectedUser: Participant | null;
}

const initialState: ChatSliceType = {
  messages: [],
  currentUser: null,
  selectedUser: null,
};

export const fetchChatMessages = createAsyncThunk<Message[], void, {}>("/api/chat/messages/", async () => {
  const response = await axios.get("https://kgt.inventoryr.online/api/chat/messages/", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data.results;
});

export const fetchCurrentUser = createAsyncThunk<Participant, void, {}>("/api/users/current/", async () => {
  const response = await axios.get("https://kgt.inventoryr.online/apis/users/current/", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
});

const ChatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<Participant>) => {
      state.selectedUser = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
      if (state.messages.length > 0 && !state.selectedUser) {
        const currentUserId = state.currentUser?.id;
        const otherParticipant = state.messages[0].room.participants.find(p => p.id !== currentUserId);
        if (otherParticipant) {
          state.selectedUser = otherParticipant;
        }
      }
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
  },
});

export const { setSelectedUser, addMessage } = ChatSlice.actions;

export default ChatSlice.reducer;