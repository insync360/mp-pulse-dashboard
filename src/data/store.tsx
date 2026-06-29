import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  Attachment, Case, Citizen, Commitment, DataState, Id, Letter,
  LetterDraftPrefill, Officer, Task,
} from "./types";
import { seedData } from "./seed";

interface DataApi extends DataState {
  // Lookups
  getCitizen: (id: Id) => Citizen | undefined;
  getOfficer: (id: Id) => Officer | undefined;
  getCase: (id: Id) => Case | undefined;
  getCommitment: (id: Id) => Commitment | undefined;
  // Mutations
  updateCase: (id: Id, patch: Partial<Case>) => void;
  addCase: (c: Case) => void;
  addLetter: (l: Letter) => Letter;
  updateLetter: (id: Id, patch: Partial<Letter>) => void;
  addCommitment: (c: Commitment) => Commitment;
  updateCommitment: (id: Id, patch: Partial<Commitment>) => void;
  addAttachment: (a: Attachment) => void;
  addTask: (t: Task) => Task;
  updateTask: (id: Id, patch: Partial<Task>) => void;
  // Cross-page letter prefill
  letterDraft: LetterDraftPrefill | null;
  setLetterDraft: (d: LetterDraftPrefill | null) => void;
  consumeLetterDraft: () => LetterDraftPrefill | null;
}

const DataCtx = createContext<DataApi | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(seedData);
  const [letterDraft, setLetterDraft] = useState<LetterDraftPrefill | null>(null);

  const consumeLetterDraft = useCallback(() => {
    const d = letterDraft;
    setLetterDraft(null);
    return d;
  }, [letterDraft]);

  const api = useMemo<DataApi>(() => ({
    ...state,
    getCitizen: (id) => state.citizens.find((c) => c.id === id),
    getOfficer: (id) => state.officers.find((o) => o.id === id),
    getCase: (id) => state.cases.find((c) => c.id === id),
    getCommitment: (id) => state.commitments.find((c) => c.id === id),
    updateCase: (id, patch) =>
      setState((s) => ({ ...s, cases: s.cases.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    addCase: (c) => setState((s) => ({ ...s, cases: [c, ...s.cases] })),
    addLetter: (l) => {
      setState((s) => ({ ...s, letters: [l, ...s.letters] }));
      return l;
    },
    updateLetter: (id, patch) =>
      setState((s) => ({ ...s, letters: s.letters.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
    addCommitment: (c) => {
      setState((s) => ({ ...s, commitments: [c, ...s.commitments] }));
      return c;
    },
    updateCommitment: (id, patch) =>
      setState((s) => ({ ...s, commitments: s.commitments.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    addAttachment: (a) =>
      setState((s) => ({ ...s, attachments: [a, ...s.attachments] })),
    addTask: (t) => {
      setState((s) => ({ ...s, tasks: [t, ...s.tasks] }));
      return t;
    },
    updateTask: (id, patch) =>
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
    letterDraft,
    setLetterDraft,
    consumeLetterDraft,
  }), [state, letterDraft, consumeLetterDraft]);

  return <DataCtx.Provider value={api}>{children}</DataCtx.Provider>;
}

export function useData(): DataApi {
  const v = useContext(DataCtx);
  if (!v) throw new Error("useData must be used within <DataProvider>");
  return v;
}
