import {SYMBOLS} from "./symbols";

test("all literals are unique", () => {
    const literalKeys: Set<string> = new Set();
    for (const symbol of SYMBOLS.values()) {
        if (symbol.tokenLiteral !== undefined) {
            if (literalKeys.has(symbol.tokenLiteral)) {
                throw new Error(`Duplicate token literal: "${symbol.tokenLiteral}"`);
            }
            literalKeys.add(symbol.tokenLiteral);
        }
    }
});