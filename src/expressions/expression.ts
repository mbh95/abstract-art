import {TerminalType} from "./terminals";
import {List} from "immutable";
import {randomIntLessThan} from "../math/random";

/**
 * AST representation of an expression.
 *
 * There is no guarantee that each node in the tree is a unique instance. That is why it is necessary to refer to nodes
 * by prefix index relative to some ancestor node.
 */
export default class Expression {
    readonly type: TerminalType;
    readonly name: string;
    readonly args: List<Expression>;
    readonly size: number; // total number of nodes in subtree rooted at this expression.

    constructor(type: TerminalType, name: string, args: List<Expression>) {
        this.type = type;
        this.name = name;
        this.args = args;
        this.size = args.map(arg => arg.size)
            .reduce((a, b) => a + b, 1);
    }

    public toString(): string {
        return this.flatten().map(expr => expr.name).join(" ");
    }

    public findPath(prefixIndex: number): number[] | undefined {
        if (prefixIndex < 0 || prefixIndex >= this.size) {
            return undefined;
        }
        if (prefixIndex === 0) {
            return [0];
        }
        let nextRootIndex = prefixIndex - 1;
        let offset = 1;
        for (let arg of this.args) {
            const offsetConst = offset; // Ref in lambda below needs to be const.
            const argPath = arg.findPath(nextRootIndex);
            if (argPath !== undefined) {
                const offsetSubpath = argPath.map(relative => relative + offsetConst);
                return [0, ...offsetSubpath];
            }
            nextRootIndex -= arg.size;
            offset += arg.size;
        }
        return undefined;
    }

    public nearestCommonAncestor(prefixIndex1: number, prefixIndex2: number): number | undefined {
        const path1 = this.findPath(prefixIndex1);
        const path2 = this.findPath(prefixIndex2);
        if (path1 === undefined || path2 === undefined) {
            return undefined;
        }
        let j = path2.length - 1;
        for (let i = path1.length - 1; i >= 0; i--) {
            while (j > 0 && path2[j] > path1[i]) {
                j--;
            }
            if (path1[i] === path2[j]) {
                return path1[i];
            }
        }
        return 0;
    }

    public flatten(): List<Expression> {
        return List.of<Expression>(this)
            .concat(this.args.flatMap((expr) => expr.flatten()));
    }

    public get(prefixIndex: number): Expression | undefined {
        return this.flatten().get(prefixIndex);
    }

    public set(prefixIndex: number, exp: Expression): Expression {
        if (prefixIndex < 0 || prefixIndex >= this.size) {
            return this;
        }
        if (prefixIndex === 0) {
            return exp;
        }
        let nextRootIndex = prefixIndex - 1;
        const newArgs: Expression[] = []
        for(let arg of this.args) {
            newArgs.push(arg.set(nextRootIndex, exp));
            nextRootIndex -= arg.size;
        }
        return new Expression(this.type, this.name, List.of(...newArgs));
    }

    public randomSubExpression(): number {
        return randomIntLessThan(this.size);
    }

    /**
     * Choose a random node where each node is weighted by how many node pairs it is the nearest common ancestor of.
     */
    public randomSubExpressionAncestorWeighted(): number {
        const exp1Index = randomIntLessThan(this.size);
        const exp2Index = randomIntLessThan(this.size);
        return this.nearestCommonAncestor(exp1Index, exp2Index)!;
    }
}

