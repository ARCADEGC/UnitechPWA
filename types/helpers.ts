export type PromiseType<T extends (...args: any[]) => Promise<any>> =
    ReturnType<T> extends Promise<infer R> ? R : never;
