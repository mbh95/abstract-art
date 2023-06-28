import Expression from "./expression";
import { randomIntLessThan } from "../math/random";
import { getSymbol } from "./symbols";
import { chooseWeighted, CUMULATIVE_SYMBOL_WEIGHTS_BY_DEGREE, randomConst } from "./generator";

export function breed(parents: Expression[], n = -1): Expression[] {
    if (n < 0) {
        n = parents.length;
    }
    let children = [];
    for (let i = 0; i < n; i++) {
        const p1 = parents[randomIntLessThan(parents.length)];
        const p2 = parents[randomIntLessThan(parents.length)];
        children.push(mutate(cross(p1, p2)));
    }
    return children;
}

export function cross(exp1: Expression, exp2: Expression): Expression {
    const sub1 = exp1.randomSubExpressionAncestorBiased();
    const sub2 = exp2.randomSubExpressionAncestorBiased();
    return exp1.set(sub1, exp2.get(sub2)!);
}

function substitute(exp: Expression): Expression {
    const replacement = chooseWeighted(CUMULATIVE_SYMBOL_WEIGHTS_BY_DEGREE[exp.args.size]);
    if (replacement === undefined) {
        return exp;
    }
    const replacementMeta = getSymbol(replacement)!;
    if (replacementMeta.numArgs !== exp.args.size) {
        throw new Error("Arity mismatch during substitution mutation.");
    }
    // TODO: Handle this better.
    if (replacementMeta.tokenLiteral === undefined) {
        return randomConst(-10, 10);
    }
    return new Expression(replacement, replacementMeta.tokenLiteral, exp.args);
}

export function mutate(exp: Expression): Expression {
    const r = Math.random();
    let newExp = exp;
    if (r < 0.99) { // none
    } else if (r < 1.0) { // substitution
        newExp = substitute(exp);
    }
    return newExp.mapArgs(mutate);
}