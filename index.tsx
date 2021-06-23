import React from 'react';
import ReactDOM from 'react-dom';
import DynamicView from "./view/dynamicView";
import "./index.css";

ReactDOM.render(
    <div>
        <DynamicView initialSrc={"rgb\n(* (% x t) x)\n(% y t)\n(* x y)"}/>
        <DynamicView initialSrc={"rgb % t % x y * t * x y / t / x y"}/>
        <DynamicView initialSrc={"rgb (* (* t x) y) (* (- 1 t) (- x y)) (* (- 0.5 t) (- 1 x))"}/>
    </div>, document.getElementById('root'));