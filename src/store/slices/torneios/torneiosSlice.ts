import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../../lib/supabaseClient";
import { Equipe } from "../equipes/equipesSlice";

export interface Torneio {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string | null;
  temporada: number;
  created_at: string;
  naipe: string | null;
}

export interface EquipeNoTorneio extends Equipe {
  chave: number | null;
}

export interface TorneioComEquipes extends Torneio {
  equipes: EquipeNoTorneio[];
}

interface TorneiosState {
  torneios: Torneio[];
  selectedTorneioComEquipes: TorneioComEquipes | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TorneiosState = {
  torneios: [],
  selectedTorneioComEquipes: null,
  status: "idle",
  error: null,
};

export const fetchTorneios = createAsyncThunk(
  "torneios/fetchTorneios",
  async () => {
    const { data, error } = await supabase
      .from("torneios")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Torneio[];
  }
);

export const createTorneio = createAsyncThunk(
  "torneios/createTorneio",
  async (novoTorneio: {
    nome: string;
    data_inicio: string;
    temporada: number;
  }) => {
    const { data, error } = await supabase
      .from("torneios")
      .insert([novoTorneio])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Torneio;
  }
);

export const fetchTorneioComEquipes = createAsyncThunk(
  "torneios/fetchTorneioComEquipes",
  async (torneioId: string) => {
    const { data, error } = await supabase
      .from("torneios")
      .select(`*, torneios_equipes(chave, equipes(*))`)
      .eq("id", torneioId)
      .single();

    if (error) throw new Error(error.message);

    const equipesFormatadas = data.torneios_equipes.map((item: any) => ({
      ...item.equipes,
      chave: item.chave,
    }));

    return { ...data, equipes: equipesFormatadas } as TorneioComEquipes;
  }
);

export const addEquipeToTorneio = createAsyncThunk(
  "torneios/addEquipeToTorneio",
  async ({ torneioId, equipeId }: { torneioId: string; equipeId: string }) => {
    const { error } = await supabase
      .from("torneios_equipes")
      .insert([{ torneio_id: torneioId, equipe_id: equipeId }]);
    if (error) throw new Error(error.message);
    return { torneioId, equipeId };
  }
);

export const gerarChaves = createAsyncThunk(
  "torneios/gerarChaves",
  async (
    { torneioId, numChaves }: { torneioId: string; numChaves: number },
    { dispatch }
  ) => {
    const { data: equipesNoTorneio, error: fetchError } = await supabase
      .from("torneios_equipes")
      .select("equipe_id")
      .eq("torneio_id", torneioId);

    if (fetchError || !equipesNoTorneio)
      throw new Error(fetchError?.message || "Equipes não encontradas");

    let equipeIds = equipesNoTorneio.map((item) => item.equipe_id);

    // Baralha as equipes
    for (let i = equipeIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [equipeIds[i], equipeIds[j]] = [equipeIds[j], equipeIds[i]];
    }

    // 1. Criamos um array com as letras do alfabeto para usar como nome das chaves
    const letrasChaves = ["A", "B", "C", "D", "E", "F", "G", "H"];

    // 2. Mapeamos as equipes para atribuir a letra da chave em vez do número
    const equipesParaAtualizar = equipeIds.map((equipe_id, index) => ({
      torneio_id: torneioId,
      equipe_id: equipe_id,
      chave: letrasChaves[index % numChaves], // Usa o resto da divisão para pegar a letra correta
    }));

    const { error: upsertError } = await supabase
      .from("torneios_equipes")
      .upsert(equipesParaAtualizar);
    if (upsertError) throw new Error(upsertError.message);

    dispatch(fetchTorneioComEquipes(torneioId));
  }
);

export const removeEquipeFromTorneio = createAsyncThunk(
  "torneios/removeEquipeFromTorneio",
  async (
    { torneioId, equipeId }: { torneioId: string; equipeId: string },
    { dispatch }
  ) => {
    // Apaga a linha correspondente na tabela de junção
    const { error } = await supabase
      .from("torneios_equipes")
      .delete()
      .match({ torneio_id: torneioId, equipe_id: equipeId });

    if (error) throw new Error(error.message);

    // Após remover, busca novamente os dados do torneio para atualizar a UI
    dispatch(fetchTorneioComEquipes(torneioId));
    return { equipeId };
  }
);

const torneiosSlice = createSlice({
  name: "torneios",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTorneios.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTorneios.fulfilled,
        (state, action: PayloadAction<Torneio[]>) => {
          state.status = "succeeded";
          state.torneios = action.payload;
        }
      )
      .addCase(fetchTorneios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Falha";
      })
      .addCase(
        createTorneio.fulfilled,
        (state, action: PayloadAction<Torneio>) => {
          state.torneios.unshift(action.payload);
        }
      )
      .addCase(fetchTorneioComEquipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTorneioComEquipes.fulfilled,
        (state, action: PayloadAction<TorneioComEquipes>) => {
          state.status = "succeeded";
          state.selectedTorneioComEquipes = action.payload;
        }
      )
      .addCase(fetchTorneioComEquipes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Falha ao buscar detalhes do torneio";
      })
      .addCase(addEquipeToTorneio.rejected, (state, action) => {
        state.error =
          action.error.message || "Falha ao adicionar equipe ao torneio";
      });
  },
});

export default torneiosSlice.reducer;
