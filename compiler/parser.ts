import {Map} from "immutable";
import {Scanner, Token, TokenType} from "./scanner";

export enum ExpressionType {
    CONST = "CONST",
    VAR_X = "VAR_X",
    VAR_Y = "VAR_Y",
    VAR_T = "VAR_T",
    OP_ABS = "OP_ABS",
    OP_MOD = "OP_MOD",
}

export interface Expression {
    readonly type: ExpressionType;
    readonly name: string;
    readonly args: Expression[];
}

interface ExpressionParseTableEntry {
    readonly numArgs: number;
}

// Parse metadata about different types of expressions.
const PARSE_DATA: Map<ExpressionType, ExpressionParseTableEntry> = Map<ExpressionType, ExpressionParseTableEntry>()
    .set(ExpressionType.CONST, {numArgs: 0})
    .set(ExpressionType.VAR_X, {numArgs: 0})
    .set(ExpressionType.VAR_Y, {numArgs: 0})
    .set(ExpressionType.VAR_T, {numArgs: 0})
    .set(ExpressionType.OP_ABS, {numArgs: 1})
    .set(ExpressionType.OP_MOD, {numArgs: 2});

// Subset of ops that can be parsed from a unique literal.
const LITERAL_OPS: Map<string, ExpressionType> = Map<string, ExpressionType>()
    .set("x", ExpressionType.VAR_X)
    .set("y", ExpressionType.VAR_Y)
    .set("t", ExpressionType.VAR_T)
    .set("abs", ExpressionType.OP_ABS)
    .set("%", ExpressionType.OP_MOD);

function expectEnd(scan: Scanner): void {
    const nextToken = scan.nextToken();
    if (nextToken !== undefined) {
        throw Error(`Parse error: Expected end of expression, found "${nextToken}"`);
    }
}

export function parse(str: string): Expression {
    const scan: Scanner = new Scanner(str);
    const exp = parseExpression(scan);
    expectEnd(scan);
    return exp;
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
    } else if (firstToken.type === TokenType.PAREN_OPEN) {
        const exp = parseExpression(scan);
        expectAndConsume(scan, TokenType.PAREN_CLOSE);
        return exp;
    } else if (firstToken.type === TokenType.OP) {
        return parseOpAndArgList(firstToken, scan);
    } else if (firstToken.type === TokenType.CONST) {
        return parseConstant(firstToken);
    }
    throw Error(`Parse error: Unexpected token: ${firstToken}.`);
}

function parseOpAndArgList(opToken: Token, scan: Scanner): Expression {
    const type = recognizeOp(opToken);
    const typeData = PARSE_DATA.get(type);
    if (typeData === undefined) {
        throw Error(`Parse error: Expression missing metadata: ${type}.`);
    }
    const args = [];
    for (let i = 0; i < typeData.numArgs; i++) {
        args.push(parseExpression(scan));
    }
    return {
        type,
        name: opToken.val,
        args
    };
}

function recognizeOp(opToken: Token): ExpressionType {
    if (opToken.type !== TokenType.OP) {
        throw Error(`Parse error: Expected OP, found ${opToken.type}.`);
    }
    const lowerName = opToken.val.trim().toLowerCase();
    const tryLiteral = LITERAL_OPS.get(lowerName);
    if (tryLiteral !== undefined) {
        return tryLiteral;
    }
    throw Error(`Parse error: Unknown op: "${lowerName}"`);
}

function parseConstant(constToken: Token): Expression {
    return {
        type: ExpressionType.CONST,
        name: constToken.val,
        args: []
    }
}