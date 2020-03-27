import {Expression, ExpressionType} from "./expression";
import {Map} from "immutable";
import header from "raw-loader!./glsl/header.frag";


function generateFnEmitter(fnName: string): (exp: Expression) => string {
    return ((exp: Expression) => `${fnName}(${exp.args.map(arg => emit(arg)).join(", ")})`);
}

function generateInfixEmitter(joiner: string): (exp: Expression) => string {
    return ((exp: Expression) => `(${exp.args.map(arg => emit(arg)).join(joiner)})`);
}

const emitter: Map<ExpressionType, (exp: Expression) => string> = Map<ExpressionType, (exp: Expression) => string>()
    .set(ExpressionType.CONST, (exp) => `vec3(${exp.name}, ${exp.name}, ${exp.name})`)
    .set(ExpressionType.VAR_X, (exp) => `x`)
    .set(ExpressionType.VAR_Y, (exp) => `y`)
    .set(ExpressionType.VAR_T, (exp) => `t`)
    .set(ExpressionType.OP_ABS, generateFnEmitter("abs"))
    .set(ExpressionType.OP_MOD, generateFnEmitter("mod"))
    .set(ExpressionType.OP_ADD, generateInfixEmitter("+"))
    .set(ExpressionType.OP_SUB, generateInfixEmitter("-"))
    .set(ExpressionType.OP_MUL, generateInfixEmitter("*"))
    .set(ExpressionType.OP_DIV, generateInfixEmitter("/"))
    .set(ExpressionType.OP_RGB, (exp) => `vec3(${exp.args.map(arg=>`${emit(arg)}.x`).join(", ")})`)
    .set(ExpressionType.OP_BW, (exp)=>`vec3(0.3 * (${emit(exp.args[0])}).x + 0.59 * (${emit(exp.args[0])}).y + 0.11 * (${emit(exp.args[0])}).z)`);

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
