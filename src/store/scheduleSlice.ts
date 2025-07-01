import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScheduleEvent {
  id: string;
  name: string;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "10:00"
  dayOfWeek: number; // 0 for Monday, 6 for Sunday
  color: string;
  details?: string;
}

interface ScheduleState {
  events: ScheduleEvent[];
}

const initialState: ScheduleState = {
  events: [],
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<ScheduleEvent>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    updateEvent: (state, action: PayloadAction<ScheduleEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
});

export const { addEvent, removeEvent, updateEvent } = scheduleSlice.actions;
export default scheduleSlice.reducer;
