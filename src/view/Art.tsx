import {useCallback, useEffect, useRef, useState} from "react";
import {emitGlsl} from "../compiler/emitter";
import {createProgram} from "../compiler/glUtils";
import Expression from "../compiler/expression";

export default function Art(props: {
    readonly expression?: Expression;
    readonly periodSeconds: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glProgram = useRef<WebGLProgram | null>(null);
    const [time, setTime] = useState<number>(0);

    // Set up OpenGL.
    useEffect(() => {
        const canvas = canvasRef.current!;
        const gl: WebGLRenderingContext = canvas.getContext("webgl")!;

        const positionBuffer = gl.createBuffer();
        const vertices = new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, 1.0,
            1.0, -1.0
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }, []);

    // Recompile the program when expression changes.
    useEffect(() => {
        const canvas = canvasRef.current!;
        const gl: WebGLRenderingContext = canvas.getContext("webgl")!;
        try {
            const fragSrc = emitGlsl(props.expression!);
            glProgram.current = createProgram(gl, fragSrc);
        } catch (e) {
            console.error(e);
            glProgram.current = createProgram(gl);
        }
        gl.useProgram(glProgram.current);

        const positionLoc = gl.getAttribLocation(glProgram.current!, "xy_pos");
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

    }, [props.expression]);


    // Update time callback.
    const animationRequest = useRef(0);
    const startTime = useRef(0);
    const update = useCallback(() => {
        const t = (performance.now() - startTime.current) / 1000;
        setTime((t % props.periodSeconds) / props.periodSeconds);
        animationRequest.current = requestAnimationFrame(update);
    }, [props.periodSeconds]);

    // Start timer.
    useEffect(() => {
        startTime.current = performance.now();
        animationRequest.current = requestAnimationFrame(update);
        return () => {
            cancelAnimationFrame(animationRequest.current);
        };
    }, [props.expression, props.periodSeconds, update]);

    // Render on time passing or recompile.
    useEffect(() => {
        if (glProgram === undefined) {
            return;
        }
        const canvas = canvasRef.current!;
        const gl: WebGLRenderingContext = canvas.getContext("webgl")!;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        const glUniformTime = gl.getUniformLocation(glProgram.current!, "time");
        gl.uniform1f(glUniformTime, time);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, [props.expression, time]);

    return (<div className="Art">
        <canvas ref={canvasRef}/>
    </div>);
}

Art.defaultProps = {
    expr: undefined,
    periodSeconds: 5,
}