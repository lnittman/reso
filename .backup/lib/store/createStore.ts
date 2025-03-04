/**
 * Zustand Store Creator Utility
 * 
 * Provides a standardized way to create Zustand stores with proper TypeScript typings
 * and common patterns.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

/**
 * Options for creating a store
 */
export interface CreateStoreOptions<T> {
  /** Whether to enable devtools integration */
  devtools?: boolean;
  /** Whether to persist the store in localStorage */
  persist?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
  /** Debug name for the store in devtools */
  name?: string;
}

/**
 * Type for the set function in a store creator
 */
export type SetState<T> = (state: Partial<T>) => void;

/**
 * Type for the get function in a store creator
 */
export type GetState<T> = () => T;

/**
 * Creates a type-safe Zustand store with optional middleware
 */
export function createStore<T extends object>(
  initialState: T,
  stateCreator: (set: SetState<T>, get: GetState<T>) => T,
  options: CreateStoreOptions<T> = {}
) {
  const {
    devtools: enableDevtools = true,
    persist: enablePersist = false,
    storageKey,
    name = 'store'
  } = options;

  // The middleware stack
  type MiddlewareType = <U>(fn: U) => U;
  let middleware: MiddlewareType = (fn) => fn;
  
  // Add devtools middleware if enabled
  if (enableDevtools) {
    middleware = (fn) => devtools(fn, { name }) as any;
  }
  
  // Add persistence middleware if enabled
  if (enablePersist && storageKey) {
    middleware = (fn) =>
      middleware(
        persist(fn, {
          name: storageKey,
        }) as any
      );
  }

  // Create the store with middleware
  return create<T>(
    middleware((set, get) => ({
      ...initialState,
      ...stateCreator(
        (partialState) => set((state: T) => ({ ...state, ...partialState } as T)),
        get
      ),
    }))
  );
}

/**
 * Type helper for extracting the state type from a store
 */
export type StoreState<T extends ReturnType<typeof create<any>>> = T extends ReturnType<typeof create<infer S>> ? S : never;

/**
 * Use this to select multiple values from a store with shallow comparison
 */
export function useStoreSelectors<T, U extends Record<string, (state: T) => any>>(
  store: (selector: (state: T) => any, equals?: (a: any, b: any) => boolean) => any,
  selectors: U
): { [K in keyof U]: ReturnType<U[K]> } {
  return Object.entries(selectors).reduce(
    (acc, [key, selector]) => {
      acc[key as keyof U] = store(selector, shallow);
      return acc;
    },
    {} as { [K in keyof U]: ReturnType<U[K]> }
  );
} 