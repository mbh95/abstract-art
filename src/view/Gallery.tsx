import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {createArtState, selectArt, setAllArt} from "../state/gallerySlice";
import "./Gallery.css";
import {generateRandomArt} from "./App";
import Art from "./Art";
import {parse} from "../expressions/parser";
import {breed} from "../expressions/evolve";

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
    const time = useRef<number>(0);
    const art = useSelector(selectArt);
    const frames = useSelector(selectArt)
        .map((art, i) =>
            <Art art={art}
                 index={i}
                 getTime={() => time.current}
                 getGlContext={props.getGlContext}/>);

    const dispatch = useDispatch();

    // Set up OpenGL.
    useEffect(() => {
        const startTime = performance.now();
        const gl = props.getGlContext();
        const glCanvas = gl.canvas as HTMLCanvasElement;
        const render = () => {
            time.current = (((performance.now() - startTime) / 1000) / 5) % 1;
            resizeCanvasToDisplaySize(glCanvas);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);
            gl.enable(gl.SAMPLES);

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
    }, [props.getGlContext]);

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
                <button onClick={() => {
                    dispatch(setAllArt({newArt: generateRandomArt()}));
                }}>Start over
                </button>
                <button onClick={() => {
                    const selectedPieces = art.filter((piece, i) => piece.selected)
                        .map(piece => parse(piece.textSource)!);
                    if (selectedPieces.length === 0) {
                        return;
                    }
                    const newArt = breed(selectedPieces, art.length)
                        .map((expression, i) => createArtState(expression.toString()));
                    dispatch(setAllArt({newArt}));
                }}>Breed selected
                </button>
            </div>
            <div className="GalleryFlow" style={{display: "flex", flexWrap: "wrap"}}>
                {frames}
            </div>
        </div>
    );
}