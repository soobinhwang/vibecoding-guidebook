"use client";

import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { initialState, prdReducer, STORAGE_KEY } from "@/lib/state";
import type { PrdAction, PrdState } from "@/lib/state";

type PrdContextValue = {
  state: PrdState;
  dispatch: Dispatch<PrdAction>;
};

const PrdContext = createContext<PrdContextValue | undefined>(undefined);

export const PrdProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(prdReducer, initialState);
  const isReady = useRef(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<PrdState>;
        dispatch({ type: "hydrate", payload: parsed });
      } catch {
        dispatch({ type: "hydrate", payload: {} });
      }
    }
    isReady.current = true;
  }, []);

  useEffect(() => {
    if (!isReady.current) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <PrdContext.Provider value={{ state, dispatch }}>{children}</PrdContext.Provider>;
};

export const usePrd = () => {
  const context = useContext(PrdContext);
  if (!context) {
    throw new Error("usePrd must be used within PrdProvider");
  }
  return context;
};
