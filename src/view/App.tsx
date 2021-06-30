import Gallery from "./Gallery";
import React, {useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtState, createArtState, selectSettings, setAllArt, updateSettings} from "../state/gallerySlice";
import {randomExpression} from "../expressions/generator";
import "./App.css";

export function generateRandomArt(n = 21): ArtState[] {
    const newArt = [];
    for (let i = 0; i < n; i++) {
        newArt.push(createArtState(randomExpression(10).toString()));
    }
    return newArt;
}

export default function App() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const settings = useSelector(selectSettings);
    const dispatch = useDispatch();

    const getGlContext = () => {
        if (canvas.current === null) {
            return null;
        }
        return canvas.current.getContext('webgl', { antialias: false });
    }

    // Generate initial functions.
    useEffect(() => {
        dispatch(setAllArt({newArt: generateRandomArt()}));
    }, [dispatch]);
    return (<div>
        <canvas ref={canvas} id="glCanvas"/>
        <button onClick={()=>dispatch(updateSettings({newSettings: {highDpiSupport: !settings.highDpiSupport}}))}>Toggle High DPI</button>
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