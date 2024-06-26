export const defaults = {
    OUTPUT_DIR: "output",
    TOTAL_PAGES: 3,
    BASE_URL: "https://web.gw.coches.net/search",
};

declare module "bun" {
  interface Env {
    BASE_URL: string;
    OUTPUT_DIR: string;
    TOTAL_PAGES?: number;
  }
}