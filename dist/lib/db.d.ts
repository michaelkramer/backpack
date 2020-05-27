declare function addDBConnection(name: string, options: Function | (() => string) | (() => string) | (() => Object) | ((v: string | number | symbol) => boolean) | ((v: Object) => boolean) | ((v: string | number | symbol) => boolean), db: Object): Function;
export { addDBConnection };
