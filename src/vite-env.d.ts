/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** WebSocket czatu klubu - np. `ws://localhost:9002` lub `wss://…` na HTTPS (strona na HTTPS i tak wymusi `wss:` przy `ws://` w tej zmiennej). */
  readonly VITE_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
