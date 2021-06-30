import React, {createRef, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectArt, setAllArt} from "../state/gallerySlice";
import "./Gallery.css";
import {createProgram} from "../gl/glUtils";
import {parse} from "../expressions/parser";
import {emitGlsl} from "../expressions/glslEmitter";
import {generateRandomArt} from "./App";
import {createSelector} from "@reduxjs/toolkit";

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

    const art = useSelector(selectArt);

    const programs = createSelector(selectArt, (art) => {
        return art.map((art, i) => {
            const gl = props.getGlContext();
            let glProgram: WebGLProgram | null = null;
            if (gl !== null) {
                console.log("Recompiling...");
                const expression = parse(art.textSource)!;
                const fragSrc = emitGlsl(expression);
                glProgram = createProgram(gl, fragSrc);
            }
            return glProgram;
        });
    });

    const frames = useSelector(selectArt).map((art, i) => {
        const frameRef = createRef<HTMLDivElement>();
        return {
            getFrame: () => frameRef.current!,
            element: (<div key={i.toString()} className={selectedIndices.has(i) ? "Selected" : "Deselected"}
                           onClick={() => {
                               const newSet = new Set(selectedIndices);
                               if (newSet.has(i)) {
                                   newSet.delete(i);
                               } else {
                                   newSet.add(i);
                               }
                               setSelectedIndices(newSet);
                           }
                           }>
                <div ref={frameRef} className="ArtFrame"/>
            </div>)
        };
    });

    const dispatch = useDispatch();

    // Set up OpenGL.
    useEffect(() => {
        const gl = props.getGlContext();
        const glCanvas = gl.canvas as HTMLCanvasElement;
        const glPrograms = programs({gallery: {art}});
        const render = () => {
            resizeCanvasToDisplaySize(glCanvas);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.SCISSOR_TEST);

            // move the canvas to top of the current scroll position
            (gl.canvas as HTMLCanvasElement).style.transform = `translateY(${window.scrollY}px) translateX(${window.scrollX}px)`;

            frames.forEach((frame, i) => {
                if (frame.getFrame() === null) {
                    return;
                }

                const rect = frame.getFrame().getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > glCanvas.clientHeight ||
                    rect.right < 0 || rect.left > glCanvas.clientWidth) {
                    return;  // it's off screen
                }
                const width = rect.right - rect.left;
                const height = rect.bottom - rect.top;
                const left = rect.left - 8;
                const bottom = glCanvas.clientHeight - rect.bottom;

                gl.viewport(left, bottom, width, height);
                gl.scissor(left, bottom, width, height);
                gl.clearColor(1, 0, 1, 1);

                const glProgram = glPrograms[i];
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.useProgram(glProgram);

                const glUniformTime = gl.getUniformLocation(glProgram!, "time");
                gl.uniform1f(glUniformTime, 0);

                const positionLoc = gl.getAttribLocation(glProgram!, "xy_pos");
                gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(positionLoc);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            });
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
    }, [props, frames, programs]);

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
                {frames.map(canvas => canvas.element)}
            </div>
        </div>
    );
}