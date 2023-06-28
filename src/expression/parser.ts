import { Scanner, TokenType } from "./scanner";
import Expression from "./expression";
import { List } from "immutable";
import { recognizeSymbol } from "./symbols";

/**
 * Parse a string representing an expression into an Expression AST.
 *
 * Grammar:
 * Expression -> (Expression)
 * Expression -> SYMBOL ArgList
 * ArgList -> Expression ArgList
 * ArgList -> _
 *
 * Each SYMBOL token represents either an Operator with a known number of arguments, a variable, or a constant value.
 */

export function parse(input: string): Expression {
    const parser: Parser = new Parser(input);
    const exp = parser.parseExpression();
    parser.expectEnd();
    return exp;
}

class Parser {
    readonly scanner: Scanner;

    constructor(input: string) {
        this.scanner = new Scanner(input);
    }

    expectEnd(): void {
        const nextToken = this.scanner.nextToken();
        if (nextToken !== undefined) {
            throw Error(`Parse error: Expected end of expression, found "${nextToken.val}"`);
        }
    }

    expectAndConsume(tokenType: TokenType): void {
        const tok = this.scanner.nextToken();
        if (tok === undefined) {
            throw Error(`Parse error: Expected token of type ${tokenType}, found none.`)
        } else if (tok.type !== tokenType) {
            throw Error(`Parse error: Expected token of type ${tokenType}, found token of type ${tok.type}.`)
        }
    }

    parseExpression(): Expression {
        const firstToken = this.scanner.nextToken();
        if (firstToken === undefined) {
            throw Error(`Parse error: Expected expression, found none.`);
        } else if (firstToken.type === TokenType.PAREN_OPEN) { // Expression -> (Expression)
            const exp = this.parseExpression();
            this.expectAndConsume(TokenType.PAREN_CLOSE);
            return exp;
        } else if (firstToken.type === TokenType.SYMBOL) { // Expression -> SYMBOL ArgList
            const sym = recognizeSymbol(firstToken.val);
            if (sym === undefined) {
                throw new Error(`Parse error: Unrecognized symbol: "${firstToken.val}"`);
            }
            // ArgList -> Expression ArgList
            // ArgList -> _
            const args = [];
            for (let i = 0; i < sym.numArgs; i++) {
                args.push(this.parseExpression());
            }
            return new Expression(
                sym.type,
                firstToken.val,
                List.of(...args));
        }
        throw Error(`Parse error: Unexpected token: ${firstToken}.`);
    }
}