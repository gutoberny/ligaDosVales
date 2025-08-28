import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Session } from "@supabase/supabase-js";

// Define a estrutura do estado de autenticação
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  sessionChecked: boolean; // <--- NOVO ESTADO
}

// O estado inicial quando a aplicação carrega
const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  sessionChecked: false, // <--- VALOR INICIAL
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User | null; session: Session | null }>
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // NOVO REDUCER para marcar que a sessão foi verificada
    setSessionChecked: (state, action: PayloadAction<boolean>) => {
      state.sessionChecked = action.payload;
    },
  },
});

export const { setUser, logout, setLoading, setSessionChecked } =
  authSlice.actions;

export default authSlice.reducer;
