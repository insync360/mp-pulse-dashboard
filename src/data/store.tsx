import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Case, Citizen, DataState, Id, Letter, Officer } from "./types";
import { seedData } from "./seed";

interface DataApi extends DataState {
  // Lookups
  getCitizen: (id: Id) => Citizen | undefined;
  getOfficer: (id: Id) => Officer | undefined;
  getCase: (id: Id) => Case | undefined;
  // Mutations
  updateCase: (id: Id, patch: Partial<Case>) => void;
  addCase: (c: Case) => void;
  addLetter: (l: Letter) => void;
}

const DataCtx = createContext<DataApi | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(seedData);

  const api = useMemo<DataApi>(() => ({
    ...state,
    getCitizen: (id) => state.citizens.find((c) => c.id === id),
    getOfficer: (id) => state.officers.find((o) => o.id === id),
    getCase: (id) => state.cases.find((c) => c.id === id),
    updateCase: (id, patch) =>
      setState((s) => ({
        ...s,
        cases: s.cases.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
    addCase: (c) => setState((s) => ({ ...s, cases: [c, ...s.cases] })),
    addLetter: (l) => setState((s) => ({ ...s, letters: [l, ...s.letters] })),
  }), [state]);

  return <DataCtx.Provider value={api}>{children}</DataCtx.Provider>;
}

export function useData(): DataApi {
  const v = useContext(DataCtx);
  if (!v) throw new Error("useData must be used within <DataProvider>");
  return v;
}
