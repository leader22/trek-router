export declare class Router<T> {
  add(method: string, path: string, handler: T): void;
  find(method: string, path: string): [T | void, Record<string, string>[]];
}
