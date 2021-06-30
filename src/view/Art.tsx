import {parse} from "../expressions/parser";
import {emitGlsl} from "../expressions/glslEmitter";
import {createProgram} from "../gl/glUtils";
import {createRef, useEffect, useState} from "react";
import {ArtState, selectSettings, toggleSelected} from "../state/gallerySlice";
import {useDispatch, useSelector} from "react-redux";

export default function Art(props: {
    art: ArtState,
    index: number,
    getTime: () => number,
    getGlContext: () => WebGLRenderingContext,
}) {
    const frameRef = createRef<HTMLDivElement>();
    const [glProgram, setGlProgram] = useState<WebGLProgram | null>(null);
    const settings = useSelector(selectSettings);
    const dispatch = useDispatch();

    // Compile gl program.
    useEffect(() => {
        const gl = props.getGlContext();
        if (gl === null) {
            return;
        }
        console.log("Recompiling...");
        const expression = parse(props.art.textSource)!;
        const fragSrc = emitGlsl(expression);
        setGlProgram(createProgram(gl, fragSrc));
    }, [props.art.textSource, props.getGlContext]);

    // Start rendering
    useEffect(() => {
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
                const pixelRatio = settings.highDpiSupport ? window.devicePixelRatio || 1 : 1;

                gl.viewport(left * pixelRatio, bottom * pixelRatio, width * pixelRatio, height * pixelRatio);
                gl.scissor(left * pixelRatio, bottom * pixelRatio, width * pixelRatio, height * pixelRatio);

                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.useProgram(glProgram);

                const glUniformTime = gl.getUniformLocation(glProgram!, "time");
                gl.uniform1f(glUniformTime, props.getTime());

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

    return <div className={"ArtFrame" + (props.art.selected ? " Selected" : " Deselected")}>
        <div ref={frameRef} className="ArtFrameClickTarget"
             onClick={() => dispatch(toggleSelected({index: props.index}))}/>
    </div>
}