export enum TokenType {
    PAREN_OPEN = "PAREN_OPEN",
    PAREN_CLOSE = "PAREN_CLOSE",
    CONST = "CONST",
    OP = "OP",
}

export interface Token {
    readonly type: TokenType;
    readonly val: string;
}
function isWhitespace(s: string): boolean {
    return /^\s+$/.test(s);
}

function isParenthesis(c: string): boolean {
    return c == "(" || c == ")";
}

function isNumber(s: string): boolean {
    return /^\d+(\.\d+)?$/.test(s);
}

export class Scanner {
    readonly input: string;

    private index: number;

    constructor(input: string) {
        console.log(`Start parsing "${input}"`);
        this.input = input;
        this.index = 0;
    }

    private nextChar(): string | undefined {
        if (this.index >= this.input.length) {
            return undefined;
        }
        return this.input.charAt(this.index++);
    }

    private prevChar(): void {
        if (this.index <= 0) {
            throw Error(`prevChar() attempted on scanner at index ${this.index}.`)
        }
        this.index--;
    }

    private skipWhitespace(): string | undefined {
        let c: string | undefined;
        do {
            c = this.nextChar();
        } while (c !== undefined && isWhitespace(c));
        return c;
    }

    nextToken(): Token | undefined {
        let tokBuf = this.skipWhitespace();
        if (tokBuf === undefined) {
            return undefined;
        }
        if (tokBuf == "(") {
            return {type: TokenType.PAREN_OPEN, val: "("};
        } else if (tokBuf == ")") {
            return {type: TokenType.PAREN_CLOSE, val: ")"};
        }
        let terminated = false;
        while (!terminated) {
            const nextChar = this.nextChar();
            if (nextChar === undefined || isWhitespace(nextChar)) {
                terminated = true;
                break;
            } else if (isParenthesis(nextChar)) {
                this.prevChar();
                terminated = true;
                break;
            } else {
                tokBuf += nextChar;
            }
        }
        if (isNumber(tokBuf)) {
            return {type: TokenType.CONST, val: tokBuf};
        }
        return {type: TokenType.OP, val: tokBuf};
    }
}