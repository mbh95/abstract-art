import defaultVert from "raw-loader!./glsl/default.vert";
import defaultFrag from "raw-loader!./glsl/default.frag";

function createShader(
    gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
    console.log(source);
    const shader: WebGLShader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(`Failed to compile ${type == gl.FRAGMENT_SHADER ? "FRAGMENT_SHADER" : (type
    == gl.VERTEX_SHADER
        ? "VERTEX_SHADER" : "UNKNOWN SHADER TYPE")}:`);
    console.error(source);
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

export function createProgram(
    gl: WebGLRenderingContext, vertexShaderSrc: string,
    fragmentShaderSrc: string): WebGLProgram | null {
    const program: WebGLProgram = gl.createProgram()!;
    const vertexShader: WebGLShader | null = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fragmentShader: WebGLShader | null = createShader(
        gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

    if (!vertexShader || !fragmentShader) {
        gl.deleteProgram(program);
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(`Failed to create GL program:`);
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}

export function tryCreateProgram(
    gl: WebGLRenderingContext, vertexShaderSrc: string,
    fragmentShaderSrc: string): WebGLProgram | null {
    let program = createProgram(gl, vertexShaderSrc, fragmentShaderSrc);
    if (program === null) {
        program = createProgram(gl, defaultVert, defaultFrag);
    }
    if (program === null) {
        throw Error(`Failed to compile even the simplest shader!`);
    }
    return program;
}