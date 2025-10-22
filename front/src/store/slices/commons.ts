import { createSlice } from '@reduxjs/toolkit';

interface CommonState {
    collapsed: boolean;
    tableRefreshCount: number;
}


const initialState: CommonState = {
    collapsed: false,
    tableRefreshCount: 0
};

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        changeCollapsed(state, action) {
            state.collapsed = action.payload
        },
        refreshTable(state) {
            state.tableRefreshCount = state.tableRefreshCount + 1
        }
    },
});

export default commonSlice;
