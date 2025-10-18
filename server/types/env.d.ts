declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NUXT_DATABASE_URL: string
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
    }
  }
}
export {}
