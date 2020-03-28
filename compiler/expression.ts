import {List, Map} from "immutable";

export enum TerminalType {
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
    readonly type: TerminalType;
    readonly name: string;
    readonly args: Expression[];
}

export interface TerminalMetadata {
    readonly type: TerminalType;
    readonly numArgs: number;
    readonly tokenLiteral?: string;
    readonly tokenRegExp?: RegExp;
}

const TERMINALS: List<TerminalMetadata> = List.of<TerminalMetadata>(
    {type: TerminalType.CONST, numArgs: 0, tokenRegExp: /^\d+(\.\d+)?$/},
    {type: TerminalType.VAR_X, numArgs: 0, tokenLiteral: "x"},
    {type: TerminalType.VAR_Y, numArgs: 0, tokenLiteral: "y"},
    {type: TerminalType.VAR_T, numArgs: 0, tokenLiteral: "t"},
    {type: TerminalType.OP_ABS, numArgs: 1, tokenLiteral: "abs"},
    {type: TerminalType.OP_ADD, numArgs: 2, tokenLiteral: "+"},
    {type: TerminalType.OP_SUB, numArgs: 2, tokenLiteral: "-"},
    {type: TerminalType.OP_MUL, numArgs: 2, tokenLiteral: "*"},
    {type: TerminalType.OP_DIV, numArgs: 2, tokenLiteral: "/"},
    {type: TerminalType.OP_MOD, numArgs: 2, tokenLiteral: "%"},
    {type: TerminalType.OP_SIN, numArgs: 1, tokenLiteral: "sin"},
    {type: TerminalType.OP_COS, numArgs: 1, tokenLiteral: "cos"},
    {type: TerminalType.OP_TAN, numArgs: 1, tokenLiteral: "tan"},
    {type: TerminalType.OP_RGB, numArgs: 3, tokenLiteral: "rgb"},
    {type: TerminalType.OP_BW, numArgs: 1, tokenLiteral: "bw"}
);
export const TERMINALS_MAP: Map<TerminalType, TerminalMetadata> = TERMINALS.toMap().mapKeys((key: number, val: TerminalMetadata)=>val.type);

export const LITERAL_TERMINALS: Map<string, TerminalMetadata> = TERMINALS_MAP
    .filter((val: TerminalMetadata, _key: TerminalType) => (val.tokenLiteral !== undefined))
    .mapKeys((k: TerminalType, v: TerminalMetadata) => v.tokenLiteral!);

export const REGEXP_TERMINALS: List<TerminalMetadata> = TERMINALS.filter(op=>op.tokenRegExp!==undefined);

export function recognizeTerminal(str: string): TerminalMetadata | undefined {
    const term = LITERAL_TERMINALS.get(str);
    if (term !== undefined) {
        return term;
    }
    for (const term of REGEXP_TERMINALS) {
        if(term.tokenRegExp!.test(str)) {
            return term;
        }
    }
}
