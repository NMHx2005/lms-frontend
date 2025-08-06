import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image?: string;
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
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
  },
});

export const { setCourses, setLoading, setError } = courseSlice.actions;
export default courseSlice.reducer; 