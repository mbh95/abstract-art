import Gallery from "./Gallery";
import React from "react";
import Editor from "./Editor";

export default function App() {
    return (<div>
        <Gallery />
        <div>
            You can write your own expression below. Unfortunately it isn't selectable yet.
        </div>
        {/*<Editor initialSrc={"rgb\n(* (% x t) x)\n(% y t)\n(* x y)"}/>*/}
        <Editor initialSrc={"rgb % t % x y * t * x y / t / x y"}/>
        {/*<Editor initialSrc={"rgb (* (* t x) y) (* (- 1 t) (- x y)) (* (- 0.5 t) (- 1 x))"}/>*/}
        {/*<Editor />*/}
        <div>
            <i>"This art may not make sense to you. It makes Ness sleepy just thinking about it. Use Paralysis to knock some sense into the painting."</i>
                <br />
            — EarthBound Player's Guide
        </div>
        <br />
        <div style={{color: "yellow"}}>
            UX developer wanted :)
        </div>
        <div style={{color: "blue"}}>
            <a href="https://github.com/mbh95/abstract-art">GitHub repo</a>
        </div>
    </div>);
}