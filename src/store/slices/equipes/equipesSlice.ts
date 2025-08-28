import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFile } from "../../../lib/storageHelper";

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

// 2. Criar os AsyncThunks
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

    // Se um ficheiro de logo foi enviado, faz o upload para o bucket 'logoEquipes'
    if (payload.logoFile) {
      logo_url = await uploadFile("logoEquipes", payload.logoFile);
    }

    // Insere na base de dados com o nome e a URL do logo (se existir)
    const { data, error } = await supabase
      .from("equipes")
      .insert([{ nome: payload.nome, logo_url }])
      .select()
      .single(); // .single() para retornar apenas um objeto

    if (error) throw new Error(error.message);
    return data as Equipe;
  }
);

// 3. Criar o Slice
const equipesSlice = createSlice({
  name: "equipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ... (casos do fetchEquipes)
      .addCase(fetchEquipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEquipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.equipes = action.payload;
      })
      .addCase(fetchEquipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Falha";
      })
      .addCase(
        createEquipe.fulfilled,
        (state, action: PayloadAction<Equipe>) => {
          state.equipes.push(action.payload);
          state.equipes.sort((a, b) => a.nome.localeCompare(b.nome));
        }
      );
  },
});

export default equipesSlice.reducer;
