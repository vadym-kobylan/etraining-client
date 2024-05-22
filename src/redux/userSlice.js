import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  role: '',
  token: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, role, token } = action.payload;
      state.id = id;
      state.role = role;
      state.token = token;
    },
    logoutUser: (state) => {
      localStorage.clear('token');
      localStorage.clear('role');
      localStorage.clear('id');
      state.id = '';
      state.role = '';
      state.token = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
