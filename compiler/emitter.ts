import {Expression, ExpressionType} from "./expression";
import {Map} from "immutable";
import header from "raw-loader!./glsl/header.frag";


function generateEmitter(fnName: string): (exp: Expression) => string {
    return ((exp: Expression) => `${fnName}(${exp.args.map(arg => emit(arg)).join(", ")})`);
}

const emitter: Map<ExpressionType, (exp: Expression) => string> = Map<ExpressionType, (exp: Expression) => string>()
    .set(ExpressionType.CONST, (exp) => `vec3(${exp.name}, ${exp.name}, ${exp.name})`)
    .set(ExpressionType.VAR_X, (exp) => `x`)
    .set(ExpressionType.VAR_Y, (exp) => `y`)
    .set(ExpressionType.VAR_T, (exp) => `t`)
    .set(ExpressionType.OP_ABS, generateEmitter("abs"))
    .set(ExpressionType.OP_MOD, generateEmitter("mod"));

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
    fragColor = vec4(${emit(exp)}, 1);
}
`;
}