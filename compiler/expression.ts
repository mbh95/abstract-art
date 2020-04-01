import {List, Map} from "immutable";
import {glslFn, glslInfix, glslLiteral} from "./emitter";

export enum TerminalType {
    CONST = "CONST",

    VAR_X = "VAR_X",
    VAR_Y = "VAR_Y",
    VAR_T = "VAR_T",

    OP_INV = "OP_INV",

    OP_ADD = "OP_ADD",
    OP_SUB = "OP_SUB",
    OP_MUL = "OP_MUL",
    OP_DIV = "OP_DIV",
    OP_MOD = "OP_MOD",
    OP_ABS = "OP_ABS",

    OP_SQRT = "OP_SQRT",
    OP_POW = "OP_POW",
    OP_EXP = "OP_EXP",
    OP_LOG = "OP_LOG",
    OP_LN = "OP_LN",

    OP_SIN = "OP_SIN",
    OP_COS = "OP_COS",
    OP_TAN = "OP_TAN",

    OP_FLOOR = "OP_FLOOR",
    OP_CEIL = "OP_CEIL",
    OP_ROUND = "OP_ROUND",
    OP_TRUNC = "OP_TRUNC",

    OP_MIN = "OP_MIN",
    OP_MAX = "OP_MAX",

    OP_CLIP = "OP_CLIP",
    OP_WRAP = "OP_WRAP",
    OP_USHIFT = "OP_USHIFT",

    OP_RGB = "OP_RGB",
    OP_BW = "OP_BW",
}

export interface Expression {
    readonly type: TerminalType;
    readonly name: string;
    readonly args: Expression[];
}

export interface TerminalMetadata {
    readonly type: TerminalType;
    readonly numArgs: number;
    readonly tokenLiteral?: string;
    readonly tokenRegExp?: RegExp;
    readonly glslEmitter: (exp: Expression) => string;
}

const TERMINALS: List<TerminalMetadata> = List.of<TerminalMetadata>(
    {
        type: TerminalType.CONST,
        numArgs: 0,
        tokenRegExp: /^-?\d+(\.\d+)?$/,
        glslEmitter: (exp) => `vec3(${exp.name}, ${exp.name}, ${exp.name})`
    },
    {type: TerminalType.VAR_X, numArgs: 0, tokenLiteral: "x", glslEmitter: glslLiteral("x")},
    {type: TerminalType.VAR_Y, numArgs: 0, tokenLiteral: "y", glslEmitter: glslLiteral("y")},
    {type: TerminalType.VAR_T, numArgs: 0, tokenLiteral: "t", glslEmitter: glslLiteral("t")},
    {type: TerminalType.OP_INV, numArgs: 1, tokenLiteral: "inv", glslEmitter: glslFn("inv")},
    {type: TerminalType.OP_ADD, numArgs: 2, tokenLiteral: "+", glslEmitter: glslInfix("+")},
    {type: TerminalType.OP_SUB, numArgs: 2, tokenLiteral: "-", glslEmitter: glslInfix("-")},
    {type: TerminalType.OP_MUL, numArgs: 2, tokenLiteral: "*", glslEmitter: glslInfix("*")},
    {type: TerminalType.OP_DIV, numArgs: 2, tokenLiteral: "/", glslEmitter: glslInfix("/")},
    {type: TerminalType.OP_MOD, numArgs: 2, tokenLiteral: "%", glslEmitter: glslFn("mod")},
    {type: TerminalType.OP_SQRT, numArgs: 1, tokenLiteral: "sqrt", glslEmitter: glslFn("sqrt")},
    {type: TerminalType.OP_POW, numArgs: 2, tokenLiteral: "pow", glslEmitter: glslFn("pow")},
    {type: TerminalType.OP_EXP, numArgs: 1, tokenLiteral: "exp", glslEmitter: glslFn("exp")},
    {type: TerminalType.OP_LOG, numArgs: 2, tokenLiteral: "log", glslEmitter: glslFn("logb")},
    {type: TerminalType.OP_LN, numArgs: 1, tokenLiteral: "ln", glslEmitter: glslFn("log")},
    {type: TerminalType.OP_ABS, numArgs: 1, tokenLiteral: "abs", glslEmitter: glslFn("abs")},
    {type: TerminalType.OP_SIN, numArgs: 1, tokenLiteral: "sin", glslEmitter: glslFn("sin")},
    {type: TerminalType.OP_COS, numArgs: 1, tokenLiteral: "cos", glslEmitter: glslFn("cos")},
    {type: TerminalType.OP_TAN, numArgs: 1, tokenLiteral: "tan", glslEmitter: glslFn("tan")},
    {type: TerminalType.OP_FLOOR, numArgs: 1, tokenLiteral: "floor", glslEmitter: glslFn("floor")},
    {type: TerminalType.OP_CEIL, numArgs: 1, tokenLiteral: "ceil", glslEmitter: glslFn("ceil")},
    {type: TerminalType.OP_ROUND, numArgs: 1, tokenLiteral: "round", glslEmitter: glslFn("round")},
    {type: TerminalType.OP_TRUNC, numArgs: 1, tokenLiteral: "trunc", glslEmitter: glslFn("trunc")},
    {type: TerminalType.OP_MIN, numArgs: 2, tokenLiteral: "min", glslEmitter: glslFn("min")},
    {type: TerminalType.OP_MAX, numArgs: 2, tokenLiteral: "max", glslEmitter: glslFn("max")},
    {type: TerminalType.OP_CLIP, numArgs: 1, tokenLiteral: "clip", glslEmitter: glslFn("clip")},
    {type: TerminalType.OP_WRAP, numArgs: 1, tokenLiteral: "wrap", glslEmitter: glslFn("wrap")},
    {type: TerminalType.OP_USHIFT, numArgs: 1, tokenLiteral: "ushift", glslEmitter: glslFn("ushift")},
    {type: TerminalType.OP_RGB, numArgs: 3, tokenLiteral: "rgb", glslEmitter: glslFn("rgb")},
    {type: TerminalType.OP_BW, numArgs: 1, tokenLiteral: "bw", glslEmitter: glslFn("bw")},
);
export const TERMINALS_MAP: Map<TerminalType, TerminalMetadata> = TERMINALS.toMap().mapKeys((key: number, val: TerminalMetadata) => val.type);

const LITERAL_TERMINALS: Map<string, TerminalMetadata> = TERMINALS_MAP
    .filter((val: TerminalMetadata, _key: TerminalType) => (val.tokenLiteral !== undefined))
    .mapKeys((k: TerminalType, v: TerminalMetadata) => v.tokenLiteral!);

const REGEXP_TERMINALS: List<TerminalMetadata> = TERMINALS.filter(op => op.tokenRegExp !== undefined);

export function recognizeTerminal(str: string): TerminalMetadata | undefined {
    const term = LITERAL_TERMINALS.get(str);
    if (term !== undefined) {
        return term;
    }
    for (const term of REGEXP_TERMINALS) {
        if (term.tokenRegExp!.test(str)) {
            return term;
        }
    }
}
