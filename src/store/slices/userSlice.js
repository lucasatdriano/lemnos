import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userImg: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserImg(state, action) {
            state.userImg = action.payload;
        },
    },
});

export const { setUserImg } = userSlice.actions;

export default userSlice.reducer;
