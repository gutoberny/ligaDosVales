import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../../lib/supabaseClient";
import { Equipe } from "../equipes/equipesSlice";
import { RootState } from "../../store";

// ========================================================================
// 1. TIPOS
// ========================================================================
export interface Partida {
  id: string;
  torneio_id: string;
  data_hora_jogo: string | null;
  chave: number | null;
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
  nomeDaSerie: string; // Ex: 'Ouro', 'Prata'
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
    return data as any[];
  }
);

export const gerarPartidasDoTorneio = createAsyncThunk(
  "partidas/gerarPartidasDoTorneio",
  async (torneioId: string, { dispatch }) => {
    // Lógica completa para gerar confrontos da fase classificatória
    const { data: equipesPorChave, error: fetchError } = await supabase
      .from("torneios_equipes")
      .select("chave, equipes(*)")
      .eq("torneio_id", torneioId)
      .not("chave", "is", null);

    if (fetchError) throw new Error(fetchError.message);

    const chaves: Record<number, Equipe[]> = equipesPorChave.reduce(
      (acc: Record<number, Equipe[]>, item: any) => {
        const chaveNum = item.chave;
        if (!acc[chaveNum]) acc[chaveNum] = [];
        acc[chaveNum].push(item.equipes);
        return acc;
      },
      {} as Record<number, Equipe[]>
    );

    const partidasParaInserir: any[] = [];
    for (const chaveNum in chaves) {
      const equipes = chaves[chaveNum];
      for (let i = 0; i < equipes.length; i++) {
        for (let j = i + 1; j < equipes.length; j++) {
          partidasParaInserir.push({
            torneio_id: torneioId,
            chave: Number(chaveNum),
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
    const { error: insertError } = await supabase
      .from("partidas")
      .insert(partidasParaInserir);
    if (insertError) throw new Error(insertError.message);

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
    return data as any;
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
    const state = getState() as RootState;

    // --- PASSO A: CALCULAR CLASSIFICAÇÃO COMPLETA DA FASE DE GRUPOS ---
    const partidasClassificatorias = state.partidas.partidas.filter(
      (p) => p.fase === "Classificatória" && p.status === "Finalizado"
    );
    const equipesDoTorneio =
      state.torneios.selectedTorneioComEquipes?.equipes || [];

    const equipesPorChave: Record<number, Equipe[]> = {};
    equipesDoTorneio.forEach((e) => {
      if (e.chave) {
        if (!equipesPorChave[e.chave]) equipesPorChave[e.chave] = [];
        equipesPorChave[e.chave].push(e);
      }
    });

    const classificacaoFinalPorChave: Record<number, any[]> = {};
    for (const chaveNumStr in equipesPorChave) {
      const chaveNum = Number(chaveNumStr);
      const equipesDoGrupo = equipesPorChave[chaveNum];
      const partidasDoGrupo = partidasClassificatorias.filter(
        (p) => p.chave === chaveNum
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
        // Lógica de pontos
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
        // Soma dos pontos de todos os sets para o Point Average
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

      classificacaoFinalPorChave[chaveNum] = Object.values(stats).sort(
        (a, b) => {
          if (b.Pts !== a.Pts) return b.Pts - a.Pts;
          if (b.V !== a.V) return b.V - a.V;
          const setAverageA = a.SP / (a.SC || 1);
          const setAverageB = b.SP / (b.SC || 1);
          if (setAverageB !== setAverageA) return setAverageB - setAverageA;
          const pointAverageA = a.PP / (a.PC || 1);
          const pointAverageB = b.PP / (b.PC || 1);
          return pointAverageB - pointAverageA;
        }
      );
    }

    // --- PASSO B: CRIAR O RANKING GERAL E GERAR SEMIFINAIS ---
    const partidasPlayoffParaInserir: any[] = [];

    // Para cada série (Ouro, Prata...)
    for (let i = 0; i < nomesDasSeries.length; i++) {
      const nomeDaSerie = nomesDasSeries[i];
      const posicaoNaChave = i; // 0 = 1º lugar, 1 = 2º lugar...

      // 1. Pega todas as equipes daquela posição (ex: todos os 1ºs lugares)
      let equipesDaSerie: any[] = [];
      for (const chaveNum in classificacaoFinalPorChave) {
        if (classificacaoFinalPorChave[chaveNum][posicaoNaChave]) {
          equipesDaSerie.push(
            classificacaoFinalPorChave[chaveNum][posicaoNaChave]
          );
        }
      }

      // 2. Ordena estas equipes pelo "Ponto Average" para criar o Ranking Geral
      equipesDaSerie.sort((a, b) => {
        const pointAverageA = a.PP / (a.PC || 1);
        const pointAverageB = b.PP / (b.PC || 1);
        return pointAverageB - pointAverageA;
      });

      // 3. Gera os confrontos da semifinal (1º vs 4º, 2º vs 3º)
      // Isto assume que teremos 4 equipes por série (ex: 4 chaves de classificação)
      if (equipesDaSerie.length === 4) {
        const rank1 = equipesDaSerie[0].equipe;
        const rank2 = equipesDaSerie[1].equipe;
        const rank3 = equipesDaSerie[2].equipe;
        const rank4 = equipesDaSerie[3].equipe;

        // Semifinal 1: 1º Geral vs 4º Geral
        partidasPlayoffParaInserir.push({
          torneio_id: torneioId,
          fase: `${nomeDaSerie} - Semifinal`,
          equipe_a_id: rank1.id,
          equipe_b_id: rank4.id,
        });
        // Semifinal 2: 2º Geral vs 3º Geral
        partidasPlayoffParaInserir.push({
          torneio_id: torneioId,
          fase: `${nomeDaSerie} - Semifinal`,
          equipe_a_id: rank2.id,
          equipe_b_id: rank3.id,
        });
      }
      // Adicionar lógica para outros números de equipes se necessário
    }

    // --- PASSO C: SALVAR NO BANCO DE DADOS ---
    // Apaga playoffs antigos (se houver) e insere os novos
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

    dispatch(fetchPartidasPorTorneio(torneioId));
  }
);

export const gerarFinais = createAsyncThunk(
  "partidas/gerarFinais",
  async (payload: GerarFinaisPayload, { dispatch }) => {
    const { torneioId, nomeDaSerie } = payload;
    const faseSemifinal = `${nomeDaSerie} - Semifinal`;

    // 1. Buscar as semifinais finalizadas da série
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

    // 2. Identificar os vencedores e perdedores
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

    // 3. Preparar as novas partidas
    const partidasFinaisParaInserir = [
      // A Final
      {
        torneio_id: torneioId,
        fase: `${nomeDaSerie} - Final`,
        equipe_a_id: vencedores[0].id,
        equipe_b_id: vencedores[1].id,
      },
      // A Disputa de 3º Lugar
      {
        torneio_id: torneioId,
        fase: `${nomeDaSerie} - Disputa 3º Lugar`,
        equipe_a_id: perdedores[0].id,
        equipe_b_id: perdedores[1].id,
      },
    ];

    // 4. Apagar jogos antigos (caso esteja a gerar novamente) e inserir os novos
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

    // 5. Atualizar a interface
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
