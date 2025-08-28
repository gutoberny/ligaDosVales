import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFile } from "../../../lib/storageHelper";

// Tipos
export interface Equipe {
  id: string;
  created_at: string;
  nome: string;
  logo_url: string | null;
}
interface EquipesState {
  equipes: Equipe[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
const initialState: EquipesState = {
  equipes: [],
  status: "idle",
  error: null,
};

// AsyncThunks
export const fetchEquipes = createAsyncThunk(
  "equipes/fetchEquipes",
  async () => {
    const { data, error } = await supabase
      .from("equipes")
      .select("*")
      .order("nome");
    if (error) throw new Error(error.message);
    return data as Equipe[];
  }
);

interface CreateEquipePayload {
  nome: string;
  logoFile?: File;
}
export const createEquipe = createAsyncThunk(
  "equipes/createEquipe",
  async (payload: CreateEquipePayload) => {
    let logo_url: string | null = null;
    if (payload.logoFile) {
      logo_url = await uploadFile("logoEquipes", payload.logoFile);
    }
    const { data, error } = await supabase
      .from("equipes")
      .insert([{ nome: payload.nome, logo_url }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Equipe;
  }
);

// --- NOVO ASYNC THUNK ---
interface UpdateEquipePayload {
  equipeId: string;
  updates: {
    nome?: string;
    logo_url?: string | null;
  };
  logoFile?: File;
}
export const updateEquipe = createAsyncThunk(
  "equipes/updateEquipe",
  async (payload: UpdateEquipePayload) => {
    let finalUpdates = { ...payload.updates };

    // Se um novo ficheiro de logo for enviado, faz o upload e atualiza a URL
    if (payload.logoFile) {
      const newLogoUrl = await uploadFile("logoEquipes", payload.logoFile);
      finalUpdates.logo_url = newLogoUrl;
    }

    const { data, error } = await supabase
      .from("equipes")
      .update(finalUpdates)
      .eq("id", payload.equipeId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Equipe;
  }
);

// --- NOVO ASYNC THUNK ---
export const deleteEquipe = createAsyncThunk(
  "equipes/deleteEquipe",
  async (equipeId: string) => {
    const { error } = await supabase
      .from("equipes")
      .delete()
      .eq("id", equipeId);
    if (error) throw new Error(error.message);
    return equipeId;
  }
);

const equipesSlice = createSlice({
  name: "equipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEquipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEquipes.fulfilled,
        (state, action: PayloadAction<Equipe[]>) => {
          state.status = "succeeded";
          state.equipes = action.payload;
        }
      )
      .addCase(fetchEquipes.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(
        createEquipe.fulfilled,
        (state, action: PayloadAction<Equipe>) => {
          state.equipes.push(action.payload);
          state.equipes.sort((a, b) => a.nome.localeCompare(b.nome));
        }
      )
      // --- NOVOS REDUCERS ---
      .addCase(
        updateEquipe.fulfilled,
        (state, action: PayloadAction<Equipe>) => {
          const index = state.equipes.findIndex(
            (e) => e.id === action.payload.id
          );
          if (index !== -1) {
            state.equipes[index] = action.payload;
          }
        }
      )
      .addCase(
        deleteEquipe.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.equipes = state.equipes.filter((e) => e.id !== action.payload);
        }
      );
  },
});

export default equipesSlice.reducer;
