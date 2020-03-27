import React from 'react';
import ReactDOM from 'react-dom';
import DynamicView from "./view/dynamicView";
import "./index.css";

ReactDOM.render(
    <div>
        <DynamicView initialSrc={"rgb * % x t x  % y t * x y"}/>
        <DynamicView initialSrc={"rgb % t % x y * t * x y / t / x y"}/>
        <DynamicView initialSrc={"rgb (* (* t x) y) (* (- 1 t) (- x y)) (* (- 0.5 t) (- 1 x))"}/>
    </div>, document.getElementById('root'));