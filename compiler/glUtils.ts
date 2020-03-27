import defaultVert from "raw-loader!./glsl/default.vert";
import defaultFrag from "raw-loader!./glsl/default.frag";

function createShader(
    gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader | null {
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
    gl: WebGL2RenderingContext, fragmentShaderSrc?: string, vertexShaderSrc?: string): WebGLProgram | null {
    const program: WebGLProgram = gl.createProgram()!;
    const vertexShader: WebGLShader | null = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc? vertexShaderSrc : defaultVert);
    const fragmentShader: WebGLShader | null = createShader(
        gl, gl.FRAGMENT_SHADER, fragmentShaderSrc? fragmentShaderSrc : defaultFrag);

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