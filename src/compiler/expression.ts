import {terminalMetadata, TerminalMetadata, TERMINALS, TerminalType} from "./terminals";
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

    public mutate(): Expression {
        const coin = Math.random()
        if (coin < 0.5) {
            const destination = this.randomSubExpression();
            const destTerm = terminalMetadata(destination.type)!;
            const validReplacements = TERMINALS.filter(term => term.numArgs === destTerm.numArgs && term.tokenLiteral !== undefined);
            const randomReplacement = validReplacements.get(Math.floor(Math.random() * validReplacements.size))!;
            const mutateHelper = (expr: Expression): Expression => {
                if (expr === destination) {
                    return new Expression(randomReplacement.type, randomReplacement.tokenLiteral!, expr.args);
                }
                return new Expression(expr.type, expr.name, expr.args.map(mutateHelper));
            }
            return mutateHelper(this);
        } else {
            return this.cross(this);
        }
    }
}

export function randomConst(min: number, max: number): Expression {
    const val = Math.random()*Math.abs(max - min) + Math.min(min, max);
    return new Expression(TerminalType.CONST, val.toString(), List.of());
}

const ZERO_ARG_TERMINALS = TERMINALS.filter(term => term.numArgs === 0);
const NON_ZERO_ARG_TERMINALS = TERMINALS.filter(term => term.numArgs !== 0);

export function randomExpression(maxDepth: number): Expression {
    if (maxDepth <= 0) {
        throw new Error("Invalid random expression depth.");
    }
    let randomTerminal: TerminalMetadata;
    if (maxDepth === 1) {
        randomTerminal = ZERO_ARG_TERMINALS.get(Math.floor(Math.random()*ZERO_ARG_TERMINALS.size))!;
    } else {
        randomTerminal = NON_ZERO_ARG_TERMINALS.get(Math.floor(Math.random()*NON_ZERO_ARG_TERMINALS.size))!;
    }
    if (randomTerminal.tokenLiteral === undefined) {
        return randomConst(-10, 10);
    }
    const args: Expression[] = [];
    for (let i = 0; i < randomTerminal.numArgs; i++) {
        args.push(randomExpression(maxDepth - 1));
    }
    return new Expression(randomTerminal.type, randomTerminal.tokenLiteral, List.of(...args));
}