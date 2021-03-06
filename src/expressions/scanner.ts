export enum TokenType {
    PAREN_OPEN = "PAREN_OPEN",
    PAREN_CLOSE = "PAREN_CLOSE",
    SYMBOL = "SYMBOL",
}

export interface Token {
    readonly type: TokenType;
    readonly val: string;
}
export function symbolToken(val: string): Token {
    return {type: TokenType.SYMBOL, val};
}

export function parenOpenToken(): Token {
    return {type: TokenType.PAREN_OPEN, val: "("};
}

export function parenCloseToken(): Token {
    return {type: TokenType.PAREN_CLOSE, val: ")"};
}

function isWhitespace(s: string): boolean {
    return /^\s+$/.test(s);
}

function isOpenParen(c: string): boolean {
    return c === "(";
}

function isCloseParen(c: string): boolean {
    return c === ")";
}

function isParen(c: string): boolean {
    return isOpenParen(c) || isCloseParen(c);
}

export class Scanner {
    readonly input: string;

    private index: number;

    constructor(input: string) {
        this.input = input;
        this.index = 0;
    }

    /**
     * Move the scanner forward by one character. Returns the new character or undefined if no more characters.
     */
    private nextChar(): string | undefined {
        if (this.index >= this.input.length) {
            return undefined;
        }
        return this.input.charAt(this.index++);
    }

    /**
     * Move the scanner backward by one character.
     */
    private prevChar(): void {
        if (this.index <= 0) {
            throw Error(`Scan error: prevChar() attempted on scanner at index ${this.index}.`)
        }
        this.index--;
    }

    /**
     * Move the scanner forward until we get to the next non-whitespace char or the end of the string. Returns the new character or undefined if no more characters.
     */
    private skipWhitespace(): string | undefined {
        let c: string | undefined;
        do {
            c = this.nextChar();
        } while (c !== undefined && isWhitespace(c));
        return c;
    }

    /**
     * Move the scanner forward by one token. Return the new token or undefined if no more tokens.
     */
    nextToken(): Token | undefined {
        let tokBuf = this.skipWhitespace();
        if (tokBuf === undefined) {
            return undefined;
        }
        if (isOpenParen(tokBuf)) {
            return parenOpenToken();
        } else if (isCloseParen(tokBuf)) {
            return parenCloseToken();
        }
        let terminated = false;
        while (!terminated) {
            const nextChar = this.nextChar();
            if (nextChar === undefined || isWhitespace(nextChar)) {
                terminated = true;
                break;
            } else if (isParen(nextChar)) {
                // Rewind by one char because we need to tokenize the delimiter in the case of parentheses.
                this.prevChar();
                terminated = true;
                break;
            } else {
                tokBuf += nextChar;
            }
        }
        return symbolToken(tokBuf);
    }
}
