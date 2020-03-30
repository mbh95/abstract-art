import React, {Component, RefObject} from 'react';
import {createProgram} from "../compiler/glUtils";
import {parse} from "../compiler/parser";
import {emitGlsl} from "../compiler/emitter";

interface MainProps {
    readonly src: string;
}

interface MainState {
    canvasRef: RefObject<HTMLCanvasElement>;
    program: WebGLProgram | null;
    startTimeMillis: number;
    elapsedMillis: number;
}

class Main extends Component<MainProps, MainState> {

    constructor(props: MainProps) {
        super(props);

        this.state = {
            canvasRef: React.createRef<HTMLCanvasElement>(),
            program: null,
            startTimeMillis: 0,
            elapsedMillis: 0,
        };
    }

    updateGlProgram(): void {

        const canvas: HTMLCanvasElement = this.state.canvasRef.current!;
        const glCtx: WebGLRenderingContext = canvas.getContext("webgl")!;

        let program: WebGLProgram;

        try {
            const ast = parse(this.props.src);
            const fragSrc = emitGlsl(ast);
            program = createProgram(glCtx, fragSrc)!;
        } catch (e) {
            console.error(e);
            program = createProgram(glCtx)!;
        }

        this.setState({program}, ()=>{
            console.log("UPDATING");

            if (this.state.program === null) {
                throw new Error("Failed to set program");
            }

            glCtx.useProgram(this.state.program);

            const positionBuffer = glCtx.createBuffer();
            const vertices = new Float32Array([
                -1.0, 1.0,
                -1.0, -1.0,
                1.0, 1.0,
                1.0, -1.0
            ]);
            glCtx.bindBuffer(glCtx.ARRAY_BUFFER, positionBuffer);
            glCtx.bufferData(glCtx.ARRAY_BUFFER, vertices, glCtx.STATIC_DRAW);

            const positionLoc = glCtx.getAttribLocation(this.state.program, "xy_pos");
            glCtx.vertexAttribPointer(positionLoc, 2, glCtx.FLOAT, false, 0, 0);
            glCtx.enableVertexAttribArray(positionLoc);

            this.setState({startTimeMillis: (new Date()).getTime()});
        });
    }

    update(): void {
        const glCtx: WebGLRenderingContext = this.state.canvasRef.current!.getContext("webgl")!;

        // update resolution
        const newWidth = this.state.canvasRef.current!.clientWidth;
        const newHeight = this.state.canvasRef.current!.clientHeight;
        if (glCtx.canvas.width !== newWidth || glCtx.canvas.height !== newHeight) {
            glCtx.canvas.width = newWidth;
            glCtx.canvas.height = newHeight;
            glCtx.viewport(0, 0, glCtx.canvas.width, glCtx.canvas.height);
        }

        const curTime = (new Date()).getTime();
        const elapsedMillis = curTime - this.state.startTimeMillis;
        const elapsedSeconds = elapsedMillis / 1000.0;

        // update time
        this.setState({
            elapsedMillis
        });

        const timeLoc = glCtx.getUniformLocation(this.state.program!, "time");
        glCtx.uniform1f(timeLoc, elapsedSeconds);

        // render
        glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);

        //repeat
        requestAnimationFrame(() => this.update());
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentDidUpdate(prevProps: Readonly<MainProps>, prevState: Readonly<MainState>, snapshot?: any): void {
        if (prevProps.src !== this.props.src) {
            this.updateGlProgram();
        }
    }

    componentDidMount() {
        this.updateGlProgram();
        requestAnimationFrame(() => this.update());
    }

    render() {
        return (
            <div className="Main">
                <canvas id="gl-canvas" ref={this.state.canvasRef}/>
            </div>
        );
    }
}

export default Main;