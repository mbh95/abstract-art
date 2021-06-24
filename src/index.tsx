import React from 'react';
import ReactDOM from 'react-dom';
import Editor from "./view/Editor";
import "./index.css";
import {parse} from "./compiler/parser";

const e = parse("+ x * y 123123");
console.log(...e.flatten());
console.log(e.toString());
console.log(e.randomSubExpression().toString());
console.log(e.cross(e).toString());


ReactDOM.render(
    <div>
        <Editor initialSrc={"rgb\n(* (% x t) x)\n(% y t)\n(* x y)"}/>
        <Editor initialSrc={"rgb % t % x y * t * x y / t / x y"}/>
        <Editor initialSrc={"rgb (* (* t x) y) (* (- 1 t) (- x y)) (* (- 0.5 t) (- 1 x))"}/>
    </div>, document.getElementById('root'));