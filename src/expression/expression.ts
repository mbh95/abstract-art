import { SymbolType } from "./symbols";
import { List } from "immutable";
import { randomIntLessThan } from "../math/random";

/**
 * AST representation of an expression.
 *
 * There is no guarantee that each node in the tree is a unique instance. That is why it is necessary to refer to nodes
 * by prefix index relative to some ancestor node.
 */
export default class Expression {
    readonly type: SymbolType;
    readonly name: string;
    readonly args: List<Expression>;
    readonly size: number; // total number of nodes in subtree rooted at this expression.

    constructor(type: SymbolType, name: string, args: List<Expression>) {
        this.type = type;
        this.name = name;
        this.args = args;
        this.size = args.map(arg => arg.size)
            .reduce((a, b) => a + b, 1);
    }

    /**
     * Flatten this expression into a list of expressions in prefix order.
     */
    public flatten(): List<Expression> {
        return List.of<Expression>(this)
            .concat(this.args.flatMap((expr) => expr.flatten()));
    }

    /**
     * Return a string representation of this expression in prefix notation.
     */
    public toString(): string {
        return this.flatten().map(expr => expr.name).join(" ");
    }

    /**
     * Apply a map function recursively to the arguments of this expression.
     */
    public mapArgs(mapFn: (arg: Expression) => Expression): Expression {
        return new Expression(this.type, this.name, this.args.map((arg) => mapFn(arg)));
    }

    /**
     * Get the sub-expression indicated by the prefix index.
     */
    public get(prefixIndex: number): Expression | undefined {
        if (prefixIndex < 0 || prefixIndex >= this.size) {
            return undefined;
        }
        if (prefixIndex === 0) {
            return this;
        }
        let nextRootIndex = prefixIndex - 1;
        for (let arg of this.args) {
            const e = arg.get(nextRootIndex);
            if (e !== undefined) {
                return e;
            }
            nextRootIndex -= arg.size;
        }
        return undefined;
    }

    /**
     * Replace the sub-expression indicated by prefixIndex by the given expression.
     */
    public set(prefixIndex: number, exp: Expression): Expression {
        if (prefixIndex < 0 || prefixIndex >= this.size) {
            return this;
        }
        if (prefixIndex === 0) {
            return exp;
        }
        let nextRootIndex = prefixIndex - 1;
        const newArgs: Expression[] = []
        for (let arg of this.args) {
            newArgs.push(arg.set(nextRootIndex, exp));
            nextRootIndex -= arg.size;
        }
        return new Expression(this.type, this.name, List.of(...newArgs));
    }

    /**
     * Find a path from the root to the sub-expression indicated by prefixIndex.
     *
     * Returns the path as a list of prefix indices or undefined if no path exists.
     */
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

    /**
     * Find the nearest common ancestor of the two sub-expressions indicated by their prefix indices.
     *
     * Returns the prefix index of the nearest common ancestor or undefined if none exists (this happens iff at least one of the sub-expressions is invalid).
     */
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

    /**
     * Choose a random sub-expression uniformly.
     */
    public randomSubExpression(): number {
        return randomIntLessThan(this.size);
    }

    /**
     * Choose a random sub-expression where each is weighted by how many sub-expression pairs it is the nearest common ancestor of.
     */
    public randomSubExpressionAncestorBiased(): number {
        const e1 = this.randomSubExpression();
        const e2 = this.randomSubExpression();
        return this.nearestCommonAncestor(e1, e2)!;
    }
}

