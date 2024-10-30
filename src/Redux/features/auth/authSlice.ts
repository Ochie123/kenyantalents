import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClaimsType } from '../../models/claims-type';

const authNamespace = 'auth';

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

// Helper function to safely set localStorage
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Helper function to safely remove localStorage item
const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Helper function to safely parse JSON from localStorage
const getLocalStorageParsedItem = (key: string): any => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export type AuthStateType = {
  readonly accessToken: string;
  readonly claims: ClaimsType | null;
  readonly userType: string | null;
  readonly emailForVerification: string | null;
};

export const initialState: AuthStateType = {
  accessToken: getLocalStorageItem('token') || '',
  claims: getLocalStorageParsedItem('claims'),
  userType: getLocalStorageItem('userType'),
  emailForVerification: null,
};

export const authSlice = createSlice({
  name: authNamespace,
  initialState,
  reducers: {
    saveTokenAction: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      setLocalStorageItem('token', action.payload);
    },
    saveClaimsAction: (state, action: PayloadAction<ClaimsType>) => {
      state.claims = action.payload;
      setLocalStorageItem('claims', JSON.stringify(action.payload));
    },
    saveUserTypeAction: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
      setLocalStorageItem('userType', action.payload);
    },
    setEmailForVerificationAction: (state, action: PayloadAction<string>) => {
      state.emailForVerification = action.payload;
    },
    clearAuthAction: (state) => {
      state.accessToken = '';
      state.claims = null;
      state.userType = null;
      state.emailForVerification = null;
      removeLocalStorageItem('token');
      removeLocalStorageItem('claims');
      removeLocalStorageItem('userType');
    },
  },
  extraReducers: builder => {},
});

export const {
  saveClaimsAction,
  saveTokenAction,
  saveUserTypeAction,
  setEmailForVerificationAction,
  clearAuthAction
} = authSlice.actions;

export default authSlice.reducer;