import {Map} from "immutable";
import header from "raw-loader!./glsl/header.frag";
import {Expression, TerminalType} from "./expression";


function generateFnEmitter(fnName: string): (exp: Expression) => string {
    return (exp: Expression) => `${fnName}(${exp.args.map(arg => emit(arg)).join(", ")})`;
}

function generateInfixEmitter(joiner: string): (exp: Expression) => string {
    return ((exp: Expression) => `(${exp.args.map(arg => emit(arg)).join(joiner)})`);
}

const emitter: Map<TerminalType, (exp: Expression) => string> = Map<TerminalType, (exp: Expression) => string>()
    .set(TerminalType.CONST, (exp) => `vec3(${exp.name}, ${exp.name}, ${exp.name})`)
    .set(TerminalType.VAR_X, (_exp) => `x`)
    .set(TerminalType.VAR_Y, (_exp) => `y`)
    .set(TerminalType.VAR_T, (_exp) => `t`)
    .set(TerminalType.OP_ADD, generateInfixEmitter("+"))
    .set(TerminalType.OP_SUB, generateInfixEmitter("-"))
    .set(TerminalType.OP_MUL, generateInfixEmitter("*"))
    .set(TerminalType.OP_DIV, generateInfixEmitter("/"))
    .set(TerminalType.OP_MOD, generateFnEmitter("mod"))
    .set(TerminalType.OP_ABS, generateFnEmitter("abs"))
    .set(TerminalType.OP_SIN, generateFnEmitter("sin"))
    .set(TerminalType.OP_COS, generateFnEmitter("cos"))
    .set(TerminalType.OP_TAN, generateFnEmitter("tan"))
    .set(TerminalType.OP_FLOOR, generateFnEmitter("floor"))
    .set(TerminalType.OP_CEIL, generateFnEmitter("ceil"))
    .set(TerminalType.OP_ROUND, generateFnEmitter("round"))
    .set(TerminalType.OP_USHIFT, generateFnEmitter("ushift"))
    .set(TerminalType.OP_RGB, generateFnEmitter("rgb"))
    .set(TerminalType.OP_BW, generateFnEmitter("bw"));

function emit(exp: Expression): string {
    return emitter.get(exp.type)!(exp);
}

export function emitGlsl(exp: Expression): string {
    return header + `
vec3 expression(vec3 x, vec3 y, vec3 t) {
    return ${emit(exp)};
}
`;
}