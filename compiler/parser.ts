import {Map} from "immutable";
import {Scanner, Token, TokenType} from "./scanner";
import {Expression, EXPRESSION_METADATA, ExpressionType} from "./expression";

// Subset of ops that can be parsed from a unique literal.
const LITERAL_OPS: Map<string, ExpressionType> = Map<string, ExpressionType>()
    .set("x", ExpressionType.VAR_X)
    .set("y", ExpressionType.VAR_Y)
    .set("t", ExpressionType.VAR_T)
    .set("abs", ExpressionType.OP_ABS)
    .set("+", ExpressionType.OP_ADD)
    .set("-", ExpressionType.OP_SUB)
    .set("*", ExpressionType.OP_MUL)
    .set("/", ExpressionType.OP_DIV)
    .set("%", ExpressionType.OP_MOD)
    .set("sin", ExpressionType.OP_SIN)
    .set("cos", ExpressionType.OP_COS)
    .set("tan", ExpressionType.OP_TAN)
    .set("rgb", ExpressionType.OP_RGB)
    .set("bw", ExpressionType.OP_BW);

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
    const typeData = EXPRESSION_METADATA.get(type);
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
