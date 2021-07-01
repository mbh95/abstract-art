import {terminalMetadata, TerminalType} from "./terminals";
import {List} from "immutable";
import Expression from "./expression";

export interface TerminalWeight {
    readonly type: TerminalType;
    readonly weight: number;
}

const TERMINAL_WEIGHTS: TerminalWeight[] = [
    {type: TerminalType.CONST, weight: 1},
    {type: TerminalType.VAR_X, weight: 1},
    {type: TerminalType.VAR_Y, weight: 1},
    {type: TerminalType.VAR_T, weight: 2},

    {type: TerminalType.OP_INV, weight: 1},
    {type: TerminalType.OP_ABS, weight: 1},
    {type: TerminalType.OP_ADD, weight: 1},
    {type: TerminalType.OP_SUB, weight: 1},
    {type: TerminalType.OP_MUL, weight: 1},
    {type: TerminalType.OP_DIV, weight: 1},
    {type: TerminalType.OP_MOD, weight: 1},
    {type: TerminalType.OP_DOT, weight: 1},
    {type: TerminalType.OP_CROSS, weight: 1},
    {type: TerminalType.OP_SQRT, weight: 1},
    {type: TerminalType.OP_POW, weight: 1},
    {type: TerminalType.OP_EXP, weight: 1},
    {type: TerminalType.OP_LOG, weight: 1},
    {type: TerminalType.OP_LN, weight: 1},
    {type: TerminalType.OP_SIN, weight: 1},
    {type: TerminalType.OP_COS, weight: 1},
    {type: TerminalType.OP_TAN, weight: 1},
    {type: TerminalType.OP_FLOOR, weight: 1},
    {type: TerminalType.OP_CEIL, weight: 1},
    {type: TerminalType.OP_ROUND, weight: 1},
    {type: TerminalType.OP_TRUNC, weight: 1},
    {type: TerminalType.OP_MIN, weight: 1},
    {type: TerminalType.OP_MAX, weight: 1},
    {type: TerminalType.OP_CLIP, weight: 1},
    {type: TerminalType.OP_WRAP, weight: 1},
    {type: TerminalType.OP_USHIFT, weight: 1},
    {type: TerminalType.OP_BLEND, weight: 1},
    {type: TerminalType.OP_V, weight: 1},
    {type: TerminalType.OP_RGB, weight: 2},
    {type: TerminalType.OP_BW, weight: 1},

    {type: TerminalType.OP_NOISE2D, weight: 2},
];

function cumulative(weights: TerminalWeight[]): TerminalWeight[] {
    let cumulativeWeights = [weights[0]];
    for (let i = 1; i < weights.length; i++) {
        cumulativeWeights.push({type: weights[i].type, weight: cumulativeWeights[i - 1].weight + weights[i].weight});
    }
    return cumulativeWeights;
}

function cumulativeByArity(weights: TerminalWeight[]): TerminalWeight[][] {
    if (weights.length === 0) {
        return [[]];
    }
    let result = [];
    const maxArity = Math.max(...weights.map((tw) => terminalMetadata(tw.type)!.numArgs));
    for (let i = 0; i <= maxArity; i++) {
        const inaryWeights = cumulative(TERMINAL_WEIGHTS
            .filter((tw) => terminalMetadata(tw.type)?.numArgs === i));
        result.push(inaryWeights);
    }
    return result;
}

export const CUMULATIVE_TERMINAL_WEIGHTS = cumulative(TERMINAL_WEIGHTS);
export const CUMULATIVE_TERMINAL_WEIGHTS_BY_ARITY = cumulativeByArity(TERMINAL_WEIGHTS)

export function chooseWeighted(cumulativeWeights: TerminalWeight[]): TerminalType | undefined {
    if (cumulativeWeights.length === 0) {
        return undefined;
    }
    // TODO: Validate that we have a monotonically increasing distribution.
    const total = cumulativeWeights[cumulativeWeights.length - 1].weight;
    const r = Math.random() * total;
    // TODO: Binary search.
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (r <= cumulativeWeights[i].weight) {
            return cumulativeWeights[i].type
        }
    }
    // Should never get here.
    throw new Error("Whoops, fell through chooseWeighted.");
}

export function randomConst(min: number, max: number): Expression {
    const val = Math.random() * Math.abs(max - min) + Math.min(min, max);
    return new Expression(TerminalType.CONST, val.toString(), List.of());
}

export function randomExpression(maxDepth: number): Expression {
    if (maxDepth <= 0) {
        throw new Error("Invalid random expression depth.");
    }
    let randomTerminal: TerminalType;
    if (maxDepth === 1) {
        randomTerminal = chooseWeighted(CUMULATIVE_TERMINAL_WEIGHTS_BY_ARITY[0])!;
    } else {
        randomTerminal = chooseWeighted(CUMULATIVE_TERMINAL_WEIGHTS)!;
    }
    const randomTerminalMetadata = terminalMetadata(randomTerminal)!;
    if (randomTerminalMetadata.tokenLiteral === undefined) {
        return randomConst(-10, 10);
    }
    const args: Expression[] = [];
    for (let i = 0; i < randomTerminalMetadata.numArgs; i++) {
        args.push(randomExpression(maxDepth - 1));
    }
    return new Expression(randomTerminal, randomTerminalMetadata.tokenLiteral, List.of(...args));
}