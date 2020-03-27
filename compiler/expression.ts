import {Map} from "immutable";

export enum ExpressionType {
    CONST = "CONST",
    VAR_X = "VAR_X",
    VAR_Y = "VAR_Y",
    VAR_T = "VAR_T",
    OP_ABS = "OP_ABS",
    OP_ADD = "OP_ADD",
    OP_SUB = "OP_SUB",
    OP_MUL = "OP_MUL",
    OP_DIV = "OP_DIV",
    OP_MOD = "OP_MOD",
    OP_SIN = "OP_SIN",
    OP_COS = "OP_COS",
    OP_TAN = "OP_TAN",
    OP_RGB = "OP_RGB",
    OP_BW = "OP_BW",
}

export interface Expression {
    readonly type: ExpressionType;
    readonly name: string;
    readonly args: Expression[];
}

interface ExpressionMetadata {
    readonly numArgs: number;
}

// Parse metadata about different types of expressions.
export const EXPRESSION_METADATA: Map<ExpressionType, ExpressionMetadata> = Map<ExpressionType, ExpressionMetadata>()
    .set(ExpressionType.CONST, {numArgs: 0})
    .set(ExpressionType.VAR_X, {numArgs: 0})
    .set(ExpressionType.VAR_Y, {numArgs: 0})
    .set(ExpressionType.VAR_T, {numArgs: 0})
    .set(ExpressionType.OP_ABS, {numArgs: 1})
    .set(ExpressionType.OP_ADD, {numArgs: 2})
    .set(ExpressionType.OP_SUB, {numArgs: 2})
    .set(ExpressionType.OP_MUL, {numArgs: 2})
    .set(ExpressionType.OP_DIV, {numArgs: 2})
    .set(ExpressionType.OP_MOD, {numArgs: 2})
    .set(ExpressionType.OP_SIN, {numArgs: 1})
    .set(ExpressionType.OP_COS, {numArgs: 1})
    .set(ExpressionType.OP_TAN, {numArgs: 1})
    .set(ExpressionType.OP_RGB, {numArgs: 3})
    .set(ExpressionType.OP_BW, {numArgs: 1});
