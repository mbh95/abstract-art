// eslint-disable-next-line import/no-webpack-loader-syntax
import header from "!raw-loader!./glsl/header.frag";
import {Expression, TERMINALS_MAP} from "./expression";

export function glslLiteral(literal: string): (exp: Expression) => string {
    return (_exp) => literal;
}

export function glslFn(fnName: string): (exp: Expression) => string {
    return (exp: Expression) => `${fnName}(${exp.args.map(arg => emit(arg)).join(", ")})`;
}

export function glslInfix(joiner: string): (exp: Expression) => string {
    return ((exp: Expression) => `(${exp.args.map(arg => emit(arg)).join(joiner)})`);
}

export function emit(exp: Expression): string {
    return TERMINALS_MAP.get(exp.type)!.glslEmitter(exp);
}

export function emitGlsl(exp: Expression): string {
    return header + `
vec3 expression(vec3 x, vec3 y, vec3 t) {
    return ${emit(exp)};
}
`;
}