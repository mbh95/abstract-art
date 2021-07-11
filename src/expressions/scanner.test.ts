import {parenCloseToken, parenOpenToken, Scanner, symbolToken, Token} from "./scanner";

function expectExactlyTokens(input: string, expectedTokens: Token[]) {
    const scanner = new Scanner(input);
    expectTokens(scanner, expectedTokens);
    expectTokens(scanner, [undefined]);
}

function expectTokens(scanner: Scanner, expectedTokens: (Token | undefined)[]) {
    for (const expectedToken of expectedTokens) {
        expect(scanner.nextToken()).toEqual(expectedToken);
    }
}

test("symbols are scanned properly", () => {
    const input = "foo bar bazzz";
    expectExactlyTokens(input, [
        symbolToken("foo"),
        symbolToken("bar"),
        symbolToken("bazzz")
    ]);
});

test("whitespace is ignored", () => {
    const input = "   \n  foo     \n          bar  bazzz    \n\n\n   ";
    expectExactlyTokens(input, [
        symbolToken("foo"),
        symbolToken("bar"),
        symbolToken("bazzz")
    ]);
});

test("parentheses are scanned properly", () => {
    const input = " ( foo(bar)\n(( (";
    const scanner = new Scanner(input);
    expectExactlyTokens(input, [
        parenOpenToken(),
        symbolToken("foo"),
        parenOpenToken(),
        symbolToken("bar"),
        parenCloseToken(),
        parenOpenToken(),
        parenOpenToken(),
        parenOpenToken()]);
});