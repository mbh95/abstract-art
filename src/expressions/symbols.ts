import {List, Map} from "immutable";
import {glslFn, glslInfix, glslLiteral} from "./glslEmitter";
import Expression from "./expression";

export enum SymbolType {
    // Terminals
    CONST = "CONST",
    VAR_X = "VAR_X",
    VAR_Y = "VAR_Y",
    VAR_T = "VAR_T",

    // Unary operators
    OP_INV = "OP_INV",
    OP_ABS = "OP_ABS",
    OP_SQRT = "OP_SQRT",
    OP_EXP = "OP_EXP",
    OP_LN = "OP_LN",
    OP_SIN = "OP_SIN",
    OP_COS = "OP_COS",
    OP_TAN = "OP_TAN",
    OP_FLOOR = "OP_FLOOR",
    OP_CEIL = "OP_CEIL",
    OP_ROUND = "OP_ROUND",
    OP_TRUNC = "OP_TRUNC",
    OP_CLIP = "OP_CLIP",
    OP_WRAP = "OP_WRAP",
    OP_USHIFT = "OP_USHIFT",
    OP_BW = "OP_BW",

    // Binary operators
    OP_ADD = "OP_ADD",
    OP_SUB = "OP_SUB",
    OP_MUL = "OP_MUL",
    OP_DIV = "OP_DIV",
    OP_MOD = "OP_MOD",
    OP_DOT = "OP_DOT",
    OP_CROSS = "OP_CROSS",
    OP_POW = "OP_POW",
    OP_LOG = "OP_LOG",
    OP_MIN = "OP_MIN",
    OP_MAX = "OP_MAX",
    OP_NOISE2D = "OP_NOISE2D",

    // Ternary operators
    OP_BLEND = "OP_BLEND",
    OP_RGB = "OP_RGB",
}

export interface Symbol {
    readonly type: SymbolType;
    readonly numArgs: number;
    readonly tokenLiteral?: string;
    readonly tokenRegExp?: RegExp;
    readonly glslEmitter: (exp: Expression) => string;
}

const SYMBOLS_LIST: List<Symbol> = List.of<Symbol>(
    // Terminals
    {
        type: SymbolType.CONST,
        numArgs: 0,
        tokenRegExp: /^-?\d+(\.\d+)?$/,
        glslEmitter: (exp) => `vec3(${exp.name}, ${exp.name}, ${exp.name})`
    },
    {type: SymbolType.VAR_X, numArgs: 0, tokenLiteral: "x", glslEmitter: glslLiteral("x")},
    {type: SymbolType.VAR_Y, numArgs: 0, tokenLiteral: "y", glslEmitter: glslLiteral("y")},
    {type: SymbolType.VAR_T, numArgs: 0, tokenLiteral: "t", glslEmitter: glslLiteral("t")},

    // Unary operators
    {type: SymbolType.OP_INV, numArgs: 1, tokenLiteral: "inv", glslEmitter: glslFn("inv")},
    {type: SymbolType.OP_ABS, numArgs: 1, tokenLiteral: "abs", glslEmitter: glslFn("abs")},
    {type: SymbolType.OP_SQRT, numArgs: 1, tokenLiteral: "sqrt", glslEmitter: glslFn("sqrt")},
    {type: SymbolType.OP_EXP, numArgs: 1, tokenLiteral: "exp", glslEmitter: glslFn("exp")},
    {type: SymbolType.OP_LN, numArgs: 1, tokenLiteral: "ln", glslEmitter: glslFn("log")},
    {type: SymbolType.OP_SIN, numArgs: 1, tokenLiteral: "sin", glslEmitter: glslFn("sin")},
    {type: SymbolType.OP_COS, numArgs: 1, tokenLiteral: "cos", glslEmitter: glslFn("cos")},
    {type: SymbolType.OP_TAN, numArgs: 1, tokenLiteral: "tan", glslEmitter: glslFn("tan")},
    {type: SymbolType.OP_FLOOR, numArgs: 1, tokenLiteral: "floor", glslEmitter: glslFn("floor")},
    {type: SymbolType.OP_CEIL, numArgs: 1, tokenLiteral: "ceil", glslEmitter: glslFn("ceil")},
    {type: SymbolType.OP_ROUND, numArgs: 1, tokenLiteral: "round", glslEmitter: glslFn("round")},
    {type: SymbolType.OP_TRUNC, numArgs: 1, tokenLiteral: "trunc", glslEmitter: glslFn("trunc")},
    {type: SymbolType.OP_CLIP, numArgs: 1, tokenLiteral: "clip", glslEmitter: glslFn("clip")},
    {type: SymbolType.OP_WRAP, numArgs: 1, tokenLiteral: "wrap", glslEmitter: glslFn("wrap")},
    {type: SymbolType.OP_USHIFT, numArgs: 1, tokenLiteral: "ushift", glslEmitter: glslFn("ushift")},
    {type: SymbolType.OP_BW, numArgs: 1, tokenLiteral: "bw", glslEmitter: glslFn("bw")},

    // Binary operators
    {type: SymbolType.OP_ADD, numArgs: 2, tokenLiteral: "+", glslEmitter: glslInfix("+")},
    {type: SymbolType.OP_SUB, numArgs: 2, tokenLiteral: "-", glslEmitter: glslInfix("-")},
    {type: SymbolType.OP_MUL, numArgs: 2, tokenLiteral: "*", glslEmitter: glslInfix("*")},
    {type: SymbolType.OP_DIV, numArgs: 2, tokenLiteral: "/", glslEmitter: glslInfix("/")},
    {type: SymbolType.OP_MOD, numArgs: 2, tokenLiteral: "%", glslEmitter: glslFn("mod")},
    {type: SymbolType.OP_DOT, numArgs: 2, tokenLiteral: "dot", glslEmitter: glslFn("dotp")},
    {type: SymbolType.OP_CROSS, numArgs: 2, tokenLiteral: "cross", glslEmitter: glslFn("cross")},
    {type: SymbolType.OP_POW, numArgs: 2, tokenLiteral: "pow", glslEmitter: glslFn("pow")},
    {type: SymbolType.OP_LOG, numArgs: 2, tokenLiteral: "log", glslEmitter: glslFn("logb")},
     {type: SymbolType.OP_MIN, numArgs: 2, tokenLiteral: "min", glslEmitter: glslFn("min")},
    {type: SymbolType.OP_MAX, numArgs: 2, tokenLiteral: "max", glslEmitter: glslFn("max")},
    {type: SymbolType.OP_NOISE2D, numArgs: 2, tokenLiteral: "noise2d", glslEmitter: glslFn("snoise2d")},

    // Ternary operators
    {type: SymbolType.OP_BLEND, numArgs: 3, tokenLiteral: "blend", glslEmitter: glslFn("blend")},
    {type: SymbolType.OP_RGB, numArgs: 3, tokenLiteral: "rgb", glslEmitter: glslFn("rgb")},

);

export const SYMBOLS: Map<SymbolType, Symbol> = SYMBOLS_LIST.toMap()
    .mapKeys((key: number, val: Symbol) => val.type);

export function getSymbol(type: SymbolType): Symbol | undefined {
    return SYMBOLS.get(type);
}