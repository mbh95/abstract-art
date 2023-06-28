import { parse } from "../expression/parser";
import { emitGlsl } from "../expression/glslEmitter";
import { createProgram } from "../gl/glUtils";
import { createRef, useEffect, useState } from "react";
import { ArtState, selectSettings, toggleSelected } from "../state/gallerySlice";
import { useDispatch, useSelector } from "react-redux";

export default function Art(props: {
    art: ArtState,
    index: number,
    getTime: () => number,
    getGlContext: () => WebGLRenderingContext | null,
}) {
    const frameRef = createRef<HTMLDivElement>();
    const [glProgram, setGlProgram] = useState<WebGLProgram | null>(null);
    const settings = useSelector(selectSettings);
    const dispatch = useDispatch();

    const gl = props.getGlContext();
    const source = props.art.textSource;
    const getTime = props.getTime;

    // Compile gl program.
    useEffect(() => {
        if (gl === null) {
            return;
        }
        console.log("Recompiling...");
        const expression = parse(source)!;
        const fragSrc = emitGlsl(expression);
        setGlProgram(createProgram(gl, fragSrc));
    }, [gl, source]);

    // Start rendering
    useEffect(() => {
        if (gl === null) {
            return;
        }
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
                const left = rect.left;
                const bottom = glCanvas.clientHeight - rect.bottom;
                const pixelRatio = settings.highDpiSupport ? window.devicePixelRatio || 1 : 1;

                gl.viewport(left * pixelRatio, bottom * pixelRatio, width * pixelRatio, height * pixelRatio);
                gl.scissor(left * pixelRatio, bottom * pixelRatio, width * pixelRatio, height * pixelRatio);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.useProgram(glProgram);

                const glUniformTime = gl.getUniformLocation(glProgram!, "time");
                gl.uniform1f(glUniformTime, getTime());

                const positionLoc = gl.getAttribLocation(glProgram!, "xy_pos");
                gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(positionLoc);

                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            animationRequest = requestAnimationFrame(render);
        }
        animationRequest = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animationRequest);
        }
    }, [settings.highDpiSupport, frameRef, gl, glProgram, getTime]);

    return <div className={"ArtFrame" + (props.art.selected ? " Selected" : " Deselected")}>
        <div ref={frameRef} className="ArtFrameClickTarget"
            onClick={() => dispatch(toggleSelected({ index: props.index }))} />
    </div>
}