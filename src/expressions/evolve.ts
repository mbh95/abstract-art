import Expression from "./expression";
import {randomIntLessThan} from "../math/random";

export function breed(parents: Expression[], n = -1): Expression[] {
    if (n < 0) {
        n = parents.length;
    }
    let children = [];
    for (let i = 0; i < n; i++) {
        const p1 = parents[randomIntLessThan(parents.length)];
        const p2 = parents[randomIntLessThan(parents.length)];
        children.push(cross(p1, p2));
    }
    return children;
}

export function cross(exp1: Expression, exp2: Expression): Expression {
    const sub1 = exp1.randomSubExpressionAncestorWeighted();
    const sub2 = exp2.randomSubExpressionAncestorWeighted();
    return exp1.set(sub1, exp2.get(sub2)!);
}