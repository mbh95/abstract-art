import {Scanner, Token, TokenType} from "./scanner";
import {Expression} from "./expression";

/**
 * Parse a string representing an expression into an Expression AST.
 *
 * Grammar:
 * Expression -> (Expression)
 * Expression -> TERMINAL ArgList
 * ArgList -> Expression ArgList
 * ArgList -> _
 *
 * Each TERMINAL token represents either an Operator with a known number of arguments, a variable, or a constant value.
 */
export function parse(str: string): Expression {
    const scan: Scanner = new Scanner(str);
    const exp = parseExpression(scan);
    expectEnd(scan);
    return exp;
}

function expectEnd(scan: Scanner): void {
    const nextToken = scan.nextToken();
    if (nextToken !== undefined) {
        throw Error(`Parse error: Expected end of expression, found "${nextToken.val}"`);
    }
}

function expectAndConsume(scan: Scanner, tokenType: TokenType): void {
    const tok = scan.nextToken();
    if (tok === undefined) {
        throw Error(`Parse error: Expected token of type ${tokenType}, found none.`)
    } else if (tok.type !== tokenType) {
        throw Error(`Parse error: Expected token of type ${tokenType}, found token of type ${tok.type}.`)
    }
}

function parseExpression(scan: Scanner): Expression {
    const firstToken = scan.nextToken();
    if (firstToken === undefined) {
        throw Error(`Parse error: Expected expression, found none.`);
    } else if (firstToken.type === TokenType.PAREN_OPEN) { // Expression -> (Expression)
        const exp = parseExpression(scan);
        expectAndConsume(scan, TokenType.PAREN_CLOSE);
        return exp;
    } else if (firstToken.type === TokenType.TERMINAL) { // Expression -> TERMINAL ArgList
        return parseTerminalAndArgList(firstToken, scan);
    }
    throw Error(`Parse error: Unexpected token: ${firstToken}.`);
}

function parseTerminalAndArgList(token: Token, scan: Scanner): Expression {
    if (token.type !== TokenType.TERMINAL || !token.terminalMetadata) {
        throw Error(`Parse error: Invalid TERMINAL token ${token}`);
    }

    // ArgList -> Expression ArgList
    // ArgList -> _
    const args = [];
    for (let i = 0; i < token.terminalMetadata.numArgs; i++) {
        args.push(parseExpression(scan));
    }
    return {
        type: token.terminalMetadata.type,
        name: token.val,
        args
    };
}
