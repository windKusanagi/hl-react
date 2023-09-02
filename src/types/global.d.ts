declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

declare const MODE: 'development' | 'test' | 'production';
type CB = (...p: any[]) => unknown;
