import { SymbolType, getSymbol } from "./symbols";

test("All symbol types exist.", () => {
    for (const symbolType of Object.values(SymbolType)) {
        const symbol = getSymbol(symbolType);
        expect(symbol).toBeDefined();
    }
});

test("All literals are unique.", () => {
    const literalKeys: Set<string> = new Set();
    for (const symbolType of Object.values(SymbolType)) {
        const symbol = getSymbol(symbolType);
        if (symbol !== undefined && symbol.tokenLiteral !== undefined) {
            if (literalKeys.has(symbol.tokenLiteral)) {
                throw new Error(`Duplicate token literal: "${symbol.tokenLiteral}"`);
            }
            literalKeys.add(symbol.tokenLiteral);
        }
    }
});