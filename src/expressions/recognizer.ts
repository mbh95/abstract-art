import {List, Map} from "immutable";
import {Symbol, SYMBOLS, SymbolType} from "./symbols";

const LITERAL_SYMBOLS: Map<string, Symbol> = SYMBOLS
    .filter((val: Symbol, _key: SymbolType) => (val.tokenLiteral !== undefined))
    .mapKeys((k: SymbolType, v: Symbol) => v.tokenLiteral!);

const REGEXP_SYMBOLS: List<Symbol> = SYMBOLS
    .entrySeq()
    .map(([_symbolType, symbol]) => symbol)
    .filter((symbol) => symbol.tokenRegExp !== undefined)
    .toList();

export function recognizeSymbol(str: string): Symbol | undefined {
    const term = LITERAL_SYMBOLS.get(str);
    if (term !== undefined) {
        return term;
    }
    for (const term of REGEXP_SYMBOLS) {
        if (term.tokenRegExp!.test(str)) {
            return term;
        }
    }
}