import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../types/index';

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course._id === action.payload._id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course._id !== action.payload);
    }
  }
});

export const { 
  setCourses, 
  setLoading, 
  setError, 
  addCourse, 
  updateCourse, 
  removeCourse 
} = courseSlice.actions;

export default courseSlice.reducer; 