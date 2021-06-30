import Gallery from "./Gallery";
import React, {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {ArtState, setAllArt} from "../state/gallerySlice";
import {randomExpression} from "../expressions/generator";
import "./App.css";

export function generateRandomArt(n = 18): ArtState[] {
    const newArt = [];
    for (let i = 0; i < n; i++) {
        newArt.push({textSource: randomExpression(10).toString()});
    }
    return newArt;
}

export default function App() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const dispatch = useDispatch();

    const getGlContext = () => {
        return canvas.current!.getContext("webgl")!;
    }

    // Generate initial functions.
    useEffect(() => {
        dispatch(setAllArt({newArt: generateRandomArt()}));
    }, [dispatch]);
    return (<div>
        <canvas ref={canvas} id="glCanvas"/>
        <Gallery getGlContext={getGlContext}/>
        <div>
            <i>"This art may not make sense to you. It makes Ness sleepy just thinking about it. Use Paralysis to knock
                some sense into the painting."</i>
            <br/>
            — EarthBound Player's Guide
        </div>
        <br/>
        <div style={{color: "yellow"}}>
            UX developer wanted :)
        </div>
        <div style={{color: "blue"}}>
            <a href="https://github.com/mbh95/abstract-art">GitHub repo</a>
        </div>
    </div>);
}