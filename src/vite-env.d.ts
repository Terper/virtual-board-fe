/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: true;
}

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_BOARD_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
