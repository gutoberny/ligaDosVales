import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../../lib/supabaseClient";
import { EquipeNoTorneio } from "../torneios/torneiosSlice";
import { RootState } from "../../store";
import { Equipe } from "../equipes/equipesSlice";

// ========================================================================
// 1. TIPOS
// ========================================================================

export interface Partida {
  id: string;
  torneio_id: string;
  data_hora_jogo: string | null;
  chave: string | null;
  quadra: number | null;
  ordem: number | null;
  status: string;
  fase: string;
  equipe_a: Equipe;
  equipe_b: Equipe;
  pontos_equipe_a: number;
  pontos_equipe_b: number;
  placar_sets: { a: number; b: number }[];
}

interface PartidasState {
  partidas: Partida[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PartidasState = {
  partidas: [],
  status: "idle",
  error: null,
};

// Payloads para os Thunks
interface UpdatePartidaPayload {
  partidaId: string;
  ordem?: number | null;
  quadra?: number | null;
  data_hora_jogo?: string | null;
  placar_sets?: { a: number; b: number }[];
  pontos_equipe_a?: number;
  pontos_equipe_b?: number;
  status?: string;
}

interface GerarPlayoffsPayload {
  torneioId: string;
  nomesDasSeries: string[];
}

interface GerarFinaisPayload {
  torneioId: string;
  nomeDaSerie: string;
}

// ========================================================================
// 2. ASYNC THUNKS (AÇÕES)
// ========================================================================

export const fetchPartidasPorTorneio = createAsyncThunk(
  "partidas/fetchPartidasPorTorneio",
  async (torneioId: string) => {
    const { data, error } = await supabase
      .from("partidas")
      .select("*, equipe_a:equipe_a_id(*), equipe_b:equipe_b_id(*)")
      .eq("torneio_id", torneioId)
      .order("fase")
      .order("quadra", { ascending: true })
      .order("ordem", { ascending: true });
    if (error) throw new Error(error.message);
    return data as Partida[];
  }
);

export const gerarPartidasDoTorneio = createAsyncThunk(
  "partidas/gerarPartidasDoTorneio",
  async (torneioId: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const equipesDoTorneio =
      state.torneios.selectedTorneioComEquipes?.equipes || [];

    const equipesPorChave: Record<string, EquipeNoTorneio[]> = {};
    equipesDoTorneio.forEach((e) => {
      if (e.chave) {
        if (!equipesPorChave[e.chave]) equipesPorChave[e.chave] = [];
        equipesPorChave[e.chave].push(e);
      }
    });

    const partidasParaInserir: any[] = [];
    for (const chave in equipesPorChave) {
      const equipes = equipesPorChave[chave];
      for (let i = 0; i < equipes.length; i++) {
        for (let j = i + 1; j < equipes.length; j++) {
          partidasParaInserir.push({
            torneio_id: torneioId,
            chave: chave,
            equipe_a_id: equipes[i].id,
            equipe_b_id: equipes[j].id,
            fase: "Classificatória",
          });
        }
      }
    }

    await supabase
      .from("partidas")
      .delete()
      .eq("torneio_id", torneioId)
      .eq("fase", "Classificatória");
    if (partidasParaInserir.length > 0) {
      const { error: insertError } = await supabase
        .from("partidas")
        .insert(partidasParaInserir);
      if (insertError) throw new Error(insertError.message);
    }

    dispatch(fetchPartidasPorTorneio(torneioId));
  }
);

export const updatePartida = createAsyncThunk(
  "partidas/updatePartida",
  async (payload: UpdatePartidaPayload) => {
    const { partidaId, ...updateData } = payload;
    const { data, error } = await supabase
      .from("partidas")
      .update(updateData)
      .eq("id", partidaId)
      .select("*, equipe_a:equipe_a_id(*), equipe_b:equipe_b_id(*)")
      .single();
    if (error) throw new Error(error.message);
    return data as Partida;
  }
);

export const deletePartida = createAsyncThunk(
  "partidas/deletePartida",
  async (partidaId: string) => {
    const { error } = await supabase
      .from("partidas")
      .delete()
      .eq("id", partidaId);
    if (error) throw new Error(error.message);
    return partidaId;
  }
);

export const gerarPlayoffs = createAsyncThunk(
  "partidas/gerarPlayoffs",
  async (payload: GerarPlayoffsPayload, { dispatch, getState }) => {
    const { torneioId, nomesDasSeries } = payload;
    const state = getState() as RootState; // Acesso ao estado global do Redux

    // --- PASSO 1: Obter os dados necessários do estado ---
    const partidasClassificatorias = state.partidas.partidas.filter(
      (p) => p.fase === "Classificatória" && p.status === "Finalizado"
    );
    const equipesDoTorneio =
      state.torneios.selectedTorneioComEquipes?.equipes || [];

    if (equipesDoTorneio.length === 0) {
      throw new Error("Nenhuma equipe encontrada para este torneio.");
    }

    // --- PASSO 2: Agrupar as equipes pelas suas chaves ---
    const equipesPorChave: Record<string, EquipeNoTorneio[]> = {};
    equipesDoTorneio.forEach((e) => {
      if (e.chave) {
        if (!equipesPorChave[e.chave]) equipesPorChave[e.chave] = [];
        equipesPorChave[e.chave].push(e);
      }
    });

    // --- PASSO 3: Calcular a classificação final para CADA chave ---
    const classificacaoFinalPorChave: Record<string, any[]> = {};
    for (const chaveStr in equipesPorChave) {
      const equipesDoGrupo = equipesPorChave[chaveStr];
      const partidasDoGrupo = partidasClassificatorias.filter(
        (p) => p.chave === chaveStr
      );

      const stats: Record<string, any> = {};
      equipesDoGrupo.forEach((equipe) => {
        stats[equipe.id] = { equipe, V: 0, Pts: 0, SP: 0, SC: 0, PP: 0, PC: 0 };
      });

      partidasDoGrupo.forEach((partida) => {
        const equipeA = stats[partida.equipe_a.id];
        const equipeB = stats[partida.equipe_b.id];
        const setsA = partida.pontos_equipe_a;
        const setsB = partida.pontos_equipe_b;

        if (equipeA) {
          equipeA.SP += setsA;
          equipeA.SC += setsB;
        }
        if (equipeB) {
          equipeB.SP += setsB;
          equipeB.SC += setsA;
        }

        if (setsA > setsB) {
          if (equipeA) {
            equipeA.V++;
            equipeA.Pts += setsB < 2 ? 3 : 2;
          }
          if (equipeB && setsB === 2) {
            equipeB.Pts += 1;
          }
        } else {
          if (equipeB) {
            equipeB.V++;
            equipeB.Pts += setsA < 2 ? 3 : 2;
          }
          if (equipeA && setsA === 2) {
            equipeA.Pts += 1;
          }
        }

        partida.placar_sets.forEach((set) => {
          if (equipeA) {
            equipeA.PP += set.a;
            equipeA.PC += set.b;
          }
          if (equipeB) {
            equipeB.PP += set.b;
            equipeB.PC += set.a;
          }
        });
      });

      // Ordena a classificação final de cada chave
      classificacaoFinalPorChave[chaveStr] = Object.values(stats).sort(
        (a, b) => {
          if (b.Pts !== a.Pts) return b.Pts - a.Pts; // Critério 1: Pontos
          if (b.V !== a.V) return b.V - a.V; // Critério 2: Vitórias
          const setAverageA = a.SP / (a.SC || 1); // Critério 3: Set Average
          const setAverageB = b.SP / (b.SC || 1);
          if (setAverageB !== setAverageA) return setAverageB - setAverageA;
          const pointAverageA = a.PP / (a.PC || 1); // Critério 4: Point Average
          const pointAverageB = b.PP / (b.PC || 1);
          return pointAverageB - pointAverageA;
        }
      );
    }

    // --- PASSO 4: Criar o Ranking Geral dentro de cada Série e Gerar as Semifinais ---
    const partidasPlayoffParaInserir: any[] = [];

    for (let i = 0; i < nomesDasSeries.length; i++) {
      const nomeDaSerie = nomesDasSeries[i];
      const posicaoNaChave = i; // 0 = 1º lugar (Ouro), 1 = 2º lugar (Prata), etc.

      // a. Pega todas as equipes daquela posição (ex: todos os 1ºs lugares de cada chave)
      let equipesDaSerie: any[] = [];
      for (const chaveNum in classificacaoFinalPorChave) {
        if (classificacaoFinalPorChave[chaveNum][posicaoNaChave]) {
          equipesDaSerie.push(
            classificacaoFinalPorChave[chaveNum][posicaoNaChave]
          );
        }
      }

      // b. Ordena estas equipes pelo "Ponto Average" para criar o Ranking Geral
      equipesDaSerie.sort((a, b) => {
        const pointAverageA = a.PP / (a.PC || 1);
        const pointAverageB = b.PP / (b.PC || 1);
        return pointAverageB - pointAverageA;
      });

      // c. Gera os confrontos da semifinal (1º vs 4º, 2º vs 3º)
      // Assume que teremos 4 equipes por série (ex: 4 chaves na fase classificatória)
      if (equipesDaSerie.length === 4) {
        const rank1 = equipesDaSerie[0].equipe;
        const rank2 = equipesDaSerie[1].equipe;
        const rank3 = equipesDaSerie[2].equipe;
        const rank4 = equipesDaSerie[3].equipe;

        partidasPlayoffParaInserir.push({
          torneio_id: torneioId,
          fase: `${nomeDaSerie} - Semifinal`,
          equipe_a_id: rank1.id,
          equipe_b_id: rank4.id, // 1º Geral vs 4º Geral
        });
        partidasPlayoffParaInserir.push({
          torneio_id: torneioId,
          fase: `${nomeDaSerie} - Semifinal`,
          equipe_a_id: rank2.id,
          equipe_b_id: rank3.id, // 2º Geral vs 3º Geral
        });
      }
      // Futuramente, podemos adicionar lógica para outros números de equipes se necessário
    }

    // --- PASSO 5: Salvar as novas partidas no banco de dados ---
    // Apaga playoffs antigos (se houver, para permitir re-gerar) e insere os novos
    await supabase
      .from("partidas")
      .delete()
      .eq("torneio_id", torneioId)
      .not("fase", "eq", "Classificatória");
    if (partidasPlayoffParaInserir.length > 0) {
      const { error: insertError } = await supabase
        .from("partidas")
        .insert(partidasPlayoffParaInserir);
      if (insertError) throw new Error(insertError.message);
    }

    // Atualiza a interface com todas as partidas do torneio, incluindo as novas
    dispatch(fetchPartidasPorTorneio(torneioId));
  }
);

export const gerarFinais = createAsyncThunk(
  "partidas/gerarFinais",
  async (payload: GerarFinaisPayload, { dispatch }) => {
    const { torneioId, nomeDaSerie } = payload;
    const faseSemifinal = `${nomeDaSerie} - Semifinal`;

    const { data: semifinais, error: fetchError } = await supabase
      .from("partidas")
      .select("*, equipe_a:equipe_a_id(*), equipe_b:equipe_b_id(*)")
      .eq("torneio_id", torneioId)
      .eq("fase", faseSemifinal)
      .eq("status", "Finalizado");

    if (fetchError) throw new Error(fetchError.message);
    if (!semifinais || semifinais.length < 2) {
      throw new Error(
        `Não foram encontradas 2 semifinais finalizadas para a Série ${nomeDaSerie}.`
      );
    }

    const vencedores: Equipe[] = [];
    const perdedores: Equipe[] = [];
    semifinais.forEach((partida) => {
      if (partida.pontos_equipe_a > partida.pontos_equipe_b) {
        vencedores.push(partida.equipe_a);
        perdedores.push(partida.equipe_b);
      } else {
        vencedores.push(partida.equipe_b);
        perdedores.push(partida.equipe_a);
      }
    });

    const partidasFinaisParaInserir = [
      {
        torneio_id: torneioId,
        fase: `${nomeDaSerie} - Final`,
        equipe_a_id: vencedores[0].id,
        equipe_b_id: vencedores[1].id,
      },
      {
        torneio_id: torneioId,
        fase: `${nomeDaSerie} - Disputa 3º Lugar`,
        equipe_a_id: perdedores[0].id,
        equipe_b_id: perdedores[1].id,
      },
    ];

    const fasesParaApagar = [
      `${nomeDaSerie} - Final`,
      `${nomeDaSerie} - Disputa 3º Lugar`,
    ];
    await supabase
      .from("partidas")
      .delete()
      .eq("torneio_id", torneioId)
      .in("fase", fasesParaApagar);

    const { error: insertError } = await supabase
      .from("partidas")
      .insert(partidasFinaisParaInserir);
    if (insertError) throw new Error(insertError.message);

    dispatch(fetchPartidasPorTorneio(torneioId));
  }
);

// ========================================================================
// 3. SLICE E REDUCERS
// ========================================================================

const partidasSlice = createSlice({
  name: "partidas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPartidasPorTorneio.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPartidasPorTorneio.fulfilled,
        (state, action: PayloadAction<Partida[]>) => {
          state.status = "succeeded";
          state.partidas = action.payload;
        }
      )
      .addCase(fetchPartidasPorTorneio.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Falha ao buscar partidas";
      })
      // Update
      .addCase(
        updatePartida.fulfilled,
        (state, action: PayloadAction<Partida>) => {
          const index = state.partidas.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.partidas[index] = action.payload;
          }
        }
      )
      // Delete
      .addCase(
        deletePartida.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.partidas = state.partidas.filter(
            (p) => p.id !== action.payload
          );
        }
      );
  },
});

export default partidasSlice.reducer;
