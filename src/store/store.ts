import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./slices"; // <--- Importação simplificada!

export const store = configureStore({
  reducer: reducers, // <--- Usa o objeto de reducers exportado
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
