#version 300 es

precision highp float;

in vec2 xy_pos;
out vec2 pos;

void main() {
    pos = (xy_pos + vec2(1.0, 1.0)) / 2.0;
    gl_Position = vec4(xy_pos, 0, 1);
}