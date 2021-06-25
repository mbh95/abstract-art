import Gallery from "./Gallery";
import React from "react";
import Editor from "./Editor";

export default function App() {
    return (<div>
        <Gallery />
        {/*<Editor initialSrc={"rgb\n(* (% x t) x)\n(% y t)\n(* x y)"}/>*/}
        {/*<Editor initialSrc={"rgb % t % x y * t * x y / t / x y"}/>*/}
        {/*<Editor initialSrc={"rgb (* (* t x) y) (* (- 1 t) (- x y)) (* (- 0.5 t) (- 1 x))"}/>*/}
        <Editor />
    </div>);
}