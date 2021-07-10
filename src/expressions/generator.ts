import {getSymbol, SymbolType} from "./symbols";
import {List} from "immutable";
import Expression from "./expression";

export interface SymbolWeight {
    readonly type: SymbolType;
    readonly weight: number;
}

const SYMBOL_WEIGHTS: SymbolWeight[] = [
    {type: SymbolType.CONST, weight: 1},
    {type: SymbolType.VAR_X, weight: 1},
    {type: SymbolType.VAR_Y, weight: 1},
    {type: SymbolType.VAR_T, weight: 2},

    {type: SymbolType.OP_INV, weight: 1},
    {type: SymbolType.OP_ABS, weight: 1},
    {type: SymbolType.OP_ADD, weight: 1},
    {type: SymbolType.OP_SUB, weight: 1},
    {type: SymbolType.OP_MUL, weight: 1},
    {type: SymbolType.OP_DIV, weight: 1},
    {type: SymbolType.OP_MOD, weight: 1},
    {type: SymbolType.OP_DOT, weight: 1},
    {type: SymbolType.OP_CROSS, weight: 1},
    {type: SymbolType.OP_SQRT, weight: 1},
    {type: SymbolType.OP_POW, weight: 1},
    {type: SymbolType.OP_EXP, weight: 1},
    {type: SymbolType.OP_LOG, weight: 1},
    {type: SymbolType.OP_LN, weight: 1},
    {type: SymbolType.OP_SIN, weight: 1},
    {type: SymbolType.OP_COS, weight: 1},
    {type: SymbolType.OP_TAN, weight: 1},
    {type: SymbolType.OP_FLOOR, weight: 1},
    {type: SymbolType.OP_CEIL, weight: 1},
    {type: SymbolType.OP_ROUND, weight: 1},
    {type: SymbolType.OP_TRUNC, weight: 1},
    {type: SymbolType.OP_MIN, weight: 1},
    {type: SymbolType.OP_MAX, weight: 1},
    {type: SymbolType.OP_CLIP, weight: 1},
    {type: SymbolType.OP_WRAP, weight: 1},
    {type: SymbolType.OP_USHIFT, weight: 1},
    {type: SymbolType.OP_BLEND, weight: 1},
    {type: SymbolType.OP_V, weight: 1},
    {type: SymbolType.OP_RGB, weight: 2},
    {type: SymbolType.OP_BW, weight: 1},

    {type: SymbolType.OP_NOISE2D, weight: 2},
];

function cumulative(weights: SymbolWeight[]): SymbolWeight[] {
    let cumulativeWeights = [weights[0]];
    for (let i = 1; i < weights.length; i++) {
        cumulativeWeights.push({type: weights[i].type, weight: cumulativeWeights[i - 1].weight + weights[i].weight});
    }
    return cumulativeWeights;
}

function cumulativeByDegree(weights: SymbolWeight[]): SymbolWeight[][] {
    if (weights.length === 0) {
        return [[]];
    }
    let result = [];
    const maxArity = Math.max(...weights.map((tw) => getSymbol(tw.type)!.numArgs));
    for (let i = 0; i <= maxArity; i++) {
        const inaryWeights = cumulative(SYMBOL_WEIGHTS
            .filter((tw) => getSymbol(tw.type)?.numArgs === i));
        result.push(inaryWeights);
    }
    return result;
}

export const CUMULATIVE_SYMBOL_WEIGHTS = cumulative(SYMBOL_WEIGHTS);
export const CUMULATIVE_SYMBOL_WEIGHTS_BY_DEGREE = cumulativeByDegree(SYMBOL_WEIGHTS)

export function chooseWeighted(cumulativeWeights: SymbolWeight[]): SymbolType | undefined {
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
    return new Expression(SymbolType.CONST, val.toString(), List.of());
}

export function randomExpression(maxDepth: number): Expression {
    if (maxDepth <= 0) {
        throw new Error("Invalid random expression depth.");
    }
    let randomSymbolType: SymbolType;
    if (maxDepth === 1) {
        randomSymbolType = chooseWeighted(CUMULATIVE_SYMBOL_WEIGHTS_BY_DEGREE[0])!;
    } else {
        randomSymbolType = chooseWeighted(CUMULATIVE_SYMBOL_WEIGHTS)!;
    }
    const randomSymbol = getSymbol(randomSymbolType)!;
    if (randomSymbol.tokenLiteral === undefined) {
        return randomConst(-10, 10);
    }
    const args: Expression[] = [];
    for (let i = 0; i < randomSymbol.numArgs; i++) {
        args.push(randomExpression(maxDepth - 1));
    }
    return new Expression(randomSymbolType, randomSymbol.tokenLiteral, List.of(...args));
}