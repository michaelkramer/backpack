declare function addCache(name: string, options: Function | (() => string) | (() => string) | (() => Object) | ((v: string | number | symbol) => boolean) | ((v: Object) => boolean) | ((v: string | number | symbol) => boolean), cache: Object): void;
export { addCache };
