/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string;
  readonly VITE_SHEET_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
