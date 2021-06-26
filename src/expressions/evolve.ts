import Expression from "./expression";

export function cross(exp1: Expression, exp2: Expression): Expression {
    const sub1 = exp1.randomSubExpressionAncestorWeighted();
    const sub2 = exp2.randomSubExpressionAncestorWeighted();
    return exp1.set(sub1, exp2.get(sub2)!);
}