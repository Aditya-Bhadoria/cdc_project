declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      MY_CUSTOM_PROCESS_VAR?: string; 
    }
  }
}
export {};
