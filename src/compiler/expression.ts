import {TerminalType} from "./terminals";
import {List} from "immutable";

/**
 * AST representation of an expression.
 */
export default class Expression {
    readonly type: TerminalType;
    readonly name: string;
    readonly args: List<Expression>;

    constructor(type: TerminalType, name: string, args: List<Expression>) {
        this.type = type;
        this.name = name;
        this.args = args;
    }

    public toString(): string {
        return this.flatten().map(expr => expr.name).join(" ");
    }

    public flatten(): List<Expression> {
        return List.of<Expression>(this)
            .concat(this.args.flatMap((expr) => expr.flatten()));
    }

    public randomSubExpression(): Expression {
        const flattened = this.flatten();
        const randomIndex = Math.floor(Math.random() * flattened.size);
        return flattened.get(randomIndex)!;
    }

    public cross(other: Expression): Expression {
        const destination = this.randomSubExpression();
        const source = other.randomSubExpression();

        const crossHelper = (expr: Expression): Expression => {
            if (expr === destination) {
                return source;
            }
            return new Expression(expr.type, expr.name, expr.args.map(crossHelper));
        }
        return crossHelper(this);
    }
}

