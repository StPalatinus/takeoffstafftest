import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginToServer, fetchGetContacts, fetchModifyContacts } from "../../services/primaryService";

export interface MainState {
  pending: boolean;
  isLogedIng: boolean;
  isLoginButtonClicked: boolean;
  accessToken: string | null;
  user: {
    email: string | null,
    id: number | null,
    userId: number | null,
  } | null;
  viewedСontacts: {
    userId: number | null,
    contactsList: string[] | null,
    statusList: boolean[] | null,
  };
}

const initialState: MainState = {
  pending: false,
  isLogedIng: false,
  isLoginButtonClicked: false,
  accessToken: null,
  user: null,
  viewedСontacts: {
    userId:  null,
    contactsList: null,
    statusList: null,
  },
};

export const login = createAsyncThunk(
  'login',
  async (loginData: {
    password: string,
    remember: boolean,
    email: string,
  }) => {
    const response = await loginToServer(loginData);
    return response;
  }
);

export const getContacts = createAsyncThunk(
  'getUsersContacts',
  async (contactsData: {
    id: number,
    token: string,
  }) => {
    const response = await fetchGetContacts(contactsData);
    return response;
  }
);

export const modifyContacts = createAsyncThunk(
  'modifyUsersContacts',
  async (newContactData: {
    id: number,
    token: string,
    serialNumber: number,
    newContacts: string[],
  }) => {
    const response = await fetchModifyContacts(newContactData);
    return response;
  }
);

export const loginSlice = createSlice({
  name: 'toggleLogin',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.viewedСontacts =  {
        userId:  null,
        contactsList: null,
        statusList: null,
      };
      state.isLogedIng = false;
      state.isLoginButtonClicked = false;
    },
    toggleLoginFormToLogout: (state) => {
      state.isLoginButtonClicked = true;
    },
    toggleEditStatus: (state, data) => {
      if (state.viewedСontacts.statusList) {
      state.viewedСontacts.statusList[data.payload] = !state.viewedСontacts.statusList[data.payload]
      } else return state;
    },
    editContact: (state, data) => {
      if (state.viewedСontacts.contactsList) {
        state.viewedСontacts.contactsList[data.payload.serialNumber] = data.payload.newContact;
      }
    },
    removeContact: (state, data) => {
      if (state.viewedСontacts.contactsList) {
        state.viewedСontacts.contactsList.splice(data.payload, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.pending = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isLogedIng = true;
        state.pending = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLogedIng = false;
        state.pending = false;
      })
      .addCase(getContacts.pending, (state) => {
        state.pending = true;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.viewedСontacts.contactsList = action.payload.contactsList;
        state.viewedСontacts.statusList = new Array(action.payload.contactsList.length).fill(false);
        state.viewedСontacts.userId = action.payload.userId;
        state.pending = false;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.pending = false;
      })
  },
});

export const { 
  logout, 
  toggleLoginFormToLogout, 
  toggleEditStatus, 
  editContact,
  removeContact
} = loginSlice.actions;

export default loginSlice.reducer;
