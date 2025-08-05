import { createSlice } from '@reduxjs/toolkit';

interface CommonState {
    collapsed: boolean;
}

const initialState: CommonState = {
    collapsed: false
};

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        changeCollapsed(state, action) {
            state.collapsed = action.payload
        }
    },
});

export default commonSlice;
