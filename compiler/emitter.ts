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
    .set(TerminalType.OP_ABS, generateFnEmitter("abs"))
    .set(TerminalType.OP_MOD, generateFnEmitter("mod"))
    .set(TerminalType.OP_ADD, generateInfixEmitter("+"))
    .set(TerminalType.OP_SUB, generateInfixEmitter("-"))
    .set(TerminalType.OP_MUL, generateInfixEmitter("*"))
    .set(TerminalType.OP_DIV, generateInfixEmitter("/"))
    .set(TerminalType.OP_SIN, generateFnEmitter("sin"))
    .set(TerminalType.OP_COS, generateFnEmitter("cos"))
    .set(TerminalType.OP_TAN, generateFnEmitter("tan"))
    .set(TerminalType.OP_RGB, (exp) => `vec3(${exp.args.map(arg=>`${emit(arg)}.x`).join(", ")})`)
    .set(TerminalType.OP_BW, (exp)=>`vec3(0.3 * (${emit(exp.args[0])}).x + 0.59 * (${emit(exp.args[0])}).y + 0.11 * (${emit(exp.args[0])}).z)`);

function emit(exp: Expression): string {
    return emitter.get(exp.type)!(exp);
}

export function emitGlsl(exp: Expression): string {
    return header +
        `
void main() {
    vec3 x = vec3(pos.x, pos.x, pos.x);
    vec3 y = vec3(pos.y, pos.y, pos.y);
    vec3 t = vec3(time, time, time);
    gl_FragColor = vec4(${emit(exp)}, 1);
}
`;
}
