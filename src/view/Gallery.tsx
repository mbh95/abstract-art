import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectArt, setAllArt} from "../state/gallerySlice";
import "./Gallery.css";
import {generateRandomArt} from "./App";
import Art from "./Art";

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}

export default function Gallery(props: { getGlContext: () => WebGLRenderingContext }) {
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

    const frames = useSelector(selectArt).map((art, i) => <Art getGlContext={props.getGlContext} src={art.textSource}
                                                               selectCallback={() => {
                                                                   const newSet = new Set(selectedIndices);
                                                                   selectedIndices.has(i) ? newSet.delete(i) : newSet.add(i);
                                                                   setSelectedIndices(newSet);
                                                               }}/>);

    const dispatch = useDispatch();

    // Set up OpenGL.
    useEffect(() => {
        const gl = props.getGlContext();
        const glCanvas = gl.canvas as HTMLCanvasElement;
        const render = () => {
            resizeCanvasToDisplaySize(glCanvas);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);

            // move the canvas to top of the current scroll position
            (gl.canvas as HTMLCanvasElement).style.transform = `translateY(${window.scrollY}px) translateX(${window.scrollX}px)`;

            requestAnimationFrame(render);
        }
        const positionBuffer = gl.createBuffer();
        const vertices = new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, 1.0,
            1.0, -1.0
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        requestAnimationFrame(render);
    }, [props, frames]);

    return (
        <div className="Gallery">
            <div className="Instructions">
                <div>
                    Select expressions you like by clicking on them. Press "Next generation" to breed the selected
                    expressions together randomly.
                    <br/>
                    If you don't like any of the expressions then press "Random" to get new ones.
                    <br/>
                </div>
            </div>
            <div className="Controls" style={{display: "flex"}}>
                {/*<button onClick={() => dispatch(random())}>Random</button>*/}
                <button onClick={() => dispatch(setAllArt({newArt: generateRandomArt()}))}>Next generation</button>
            </div>
            <div className="GalleryFlow" style={{display: "flex", flexWrap: "wrap"}}>
                {frames}
            </div>
        </div>
    );
}