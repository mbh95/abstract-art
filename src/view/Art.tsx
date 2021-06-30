import {parse} from "../expressions/parser";
import {emitGlsl} from "../expressions/glslEmitter";
import {createProgram} from "../gl/glUtils";
import {createRef, useEffect, useRef, useState} from "react";

export default function Art(props: {
    getGlContext: () => WebGLRenderingContext,
    src: string,
    selectCallback: () => void,
}) {
    const frameRef = createRef<HTMLDivElement>();
    const [glProgram, setGlProgram] = useState<WebGLProgram | null>(null);
    // Compile gl program.
    useEffect(() => {
        const gl = props.getGlContext();
        if (gl === null) {
            return;
        }
        console.log("Recompiling...");
        const expression = parse(props.src)!;
        const fragSrc = emitGlsl(expression);
        setGlProgram(createProgram(gl, fragSrc));
    }, [props.src, props.getGlContext]);

    // Start rendering
    useEffect(() => {
        const startTime = performance.now();
        const gl = props.getGlContext();
        const glCanvas = gl.canvas as HTMLCanvasElement;

        let animationRequest = 0;
        const render = () => {
            if (frameRef.current === null) {
                return;
            }
            const rect = frameRef.current!.getBoundingClientRect();
            if (!(rect.bottom < 0 || rect.top > glCanvas.clientHeight ||
                rect.right < 0 || rect.left > glCanvas.clientWidth)) {

                const width = rect.right - rect.left;
                const height = rect.bottom - rect.top;
                const left = rect.left - 8;
                const bottom = glCanvas.clientHeight - rect.bottom;

                gl.viewport(left, bottom, width, height);
                gl.scissor(left, bottom, width, height);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.useProgram(glProgram);

                const t = (((performance.now() - startTime) / 1000) / 5) % 1;
                const glUniformTime = gl.getUniformLocation(glProgram!, "time");
                gl.uniform1f(glUniformTime, t);

                const positionLoc = gl.getAttribLocation(glProgram!, "xy_pos");
                gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(positionLoc);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
            animationRequest = requestAnimationFrame(render);
        }
        animationRequest = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animationRequest);
        }
    }, [frameRef, props, glProgram]);

    return <div onClick={props.selectCallback}>
        <div ref={frameRef} className="ArtFrame"/>
    </div>
}