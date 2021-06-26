import {parse} from "./parser";

test("parse(exp) === exp.toString()", () => {
    const strExp = "+ x * t y";
    expect(parse(strExp).toString()).toBe(strExp);
});

test("find path is correct", () => {
    const exp = parse("rgb + x y floor sin + x * y t 3");
    expect(exp.findPath(0)).toEqual([0]);
    expect(exp.findPath(-1)).toEqual(undefined);
    expect(exp.findPath(9)).toEqual([0, 4, 5, 6, 8, 9]);
});

test("find nearest common ancestor works", () => {
    const exp = parse("rgb + x y floor sin + x * y t 3");
    expect(exp.nearestCommonAncestor(7, 10)).toEqual(6);
    expect(exp.nearestCommonAncestor(7, 11)).toEqual(0);
    expect(exp.nearestCommonAncestor(1, 3)).toEqual(1);
});

test("set works", () => {
    const exp1 = parse("rgb + x y floor sin + x * y t 3");
    const exp2 = parse( "% cos y tan t");
    expect(exp1.set(0, exp2)).toEqual(exp2);
    expect(exp1.set(1, exp2).toString()).toEqual("rgb % cos y tan t floor sin + x * y t 3");
    expect(exp1.set(6, exp2).toString()).toEqual("rgb + x y floor sin % cos y tan t 3");
});