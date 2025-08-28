import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFile } from "../../../lib/storageHelper";
import { Equipe } from "../equipes/equipesSlice";
import { RootState } from "../../store";

// 1. Tipos
export interface Atleta {
  id: string;
  created_at: string;
  nome_completo: string;
  cpf: string | null;
  foto_url: string | null;
  documento_url: string | null;
  equipe_id: string;
  equipes: Pick<Equipe, "nome">; // Objeto da equipe aninhado
}

interface AtletasState {
  atletas: Atleta[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AtletasState = {
  atletas: [],
  status: "idle",
  error: null,
};

// 2. AsyncThunks
export const fetchAtletas = createAsyncThunk(
  "atletas/fetchAtletas",
  async () => {
    const { data, error } = await supabase
      .from("atletas")
      .select("*, equipes(nome)");
    if (error) throw new Error(error.message);
    return data as Atleta[];
  }
);

interface CreateAtletaPayload {
  nome_completo: string;
  cpf?: string;
  equipe_id: string;
  fotoFile?: File;
  documentoFile?: File;
}

export const createAtleta = createAsyncThunk(
  "atletas/createAtleta",
  async (payload: CreateAtletaPayload, { dispatch }) => {
    let foto_url: string | null = null;
    if (payload.fotoFile) {
      foto_url = await uploadFile("fotos", payload.fotoFile);
    }
    let documento_url: string | null = null;
    if (payload.documentoFile) {
      documento_url = await uploadFile("documentos", payload.documentoFile);
    }
    const atletaParaInserir = {
      nome_completo: payload.nome_completo,
      cpf: payload.cpf,
      equipe_id: payload.equipe_id,
      foto_url,
      documento_url,
    };
    const { data, error } = await supabase
      .from("atletas")
      .insert([atletaParaInserir])
      .select("*, equipes(nome)")
      .single();
    if (error) throw new Error(error.message);

    // Dispara a busca novamente para manter a lista completa e ordenada
    dispatch(fetchAtletas());
    return data as Atleta;
  }
);

interface UpdateAtletaPayload {
  atletaId: string;
  updates: {
    equipe_id: string;
  };
}

export const updateAtleta = createAsyncThunk(
  "atletas/updateAtleta",
  async (payload: UpdateAtletaPayload) => {
    const { atletaId, updates } = payload;
    const { data, error } = await supabase
      .from("atletas")
      .update(updates)
      .eq("id", atletaId)
      .select("*, equipes(nome)")
      .single();
    if (error) throw new Error(error.message);
    return data as Atleta;
  }
);

// 3. Slice
const atletasSlice = createSlice({
  name: "atletas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAtletas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAtletas.fulfilled,
        (state, action: PayloadAction<Atleta[]>) => {
          state.status = "succeeded";
          state.atletas = action.payload;
        }
      )
      .addCase(fetchAtletas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Falha ao buscar atletas";
      })
      .addCase(
        createAtleta.fulfilled,
        (state, action: PayloadAction<Atleta>) => {
          // A lista será atualizada pelo fetchAtletas disparado no thunk
        }
      )
      .addCase(
        updateAtleta.fulfilled,
        (state, action: PayloadAction<Atleta>) => {
          const index = state.atletas.findIndex(
            (a) => a.id === action.payload.id
          );
          if (index !== -1) {
            state.atletas[index] = action.payload;
          }
        }
      );
  },
});

export default atletasSlice.reducer;
