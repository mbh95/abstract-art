import {TerminalMetadata, TERMINALS, TerminalType} from "./terminals";
import {List} from "immutable";
import Expression from "./expression";

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