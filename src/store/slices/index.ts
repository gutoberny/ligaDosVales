import authReducer from "./auth/authSlice";
import torneiosReducer from "./torneios/torneiosSlice";
import equipesReducer from "./equipes/equipesSlice";
import atletasReducer from "./atletas/atletasSlice";
import partidasReducer from "./partidas/partidasSlice";

export const reducers = {
  auth: authReducer,
  torneios: torneiosReducer,
  equipes: equipesReducer,
  atletas: atletasReducer,
  partidas: partidasReducer,
};

export * from "./auth/authSlice";
export * from "./torneios/torneiosSlice";
export * from "./equipes/equipesSlice";
export * from "./atletas/atletasSlice";
export * from "./partidas/partidasSlice";
