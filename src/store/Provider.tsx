"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { contactApi } from "./contactApi";

/**
 * Store provider, mounted around the contact form only.
 *
 * Deliberately not in the root layout: wrapping every page in a client
 * Provider would push the whole tree across the server/client boundary
 * and cost the static pages a JavaScript bundle they have no use for.
 */
function makeStore() {
  const store = configureStore({
    reducer: { [contactApi.reducerPath]: contactApi.reducer },
    middleware: (getDefault) => getDefault().concat(contactApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // One store per mount. useState's lazy initialiser runs exactly once
  // and, unlike a ref, is safe to read during render — so the store is
  // never shared across requests during server rendering.
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
