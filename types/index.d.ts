export interface TopolysisInterface {
    test?: string[];
    [key: string]: string[];
}
export declare class CircularDependencyError extends Error {
    data: TopolysisInterface;
    constructor(message: string, data: TopolysisInterface);
}
export declare function topolysis(data: TopolysisInterface): IterableIterator<string[]>;
export default topolysis;
