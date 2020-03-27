#version 300 es

precision highp float;

in vec2 xy_pos;

void main() {
    gl_Position = vec4(xy_pos, 0, 1);
}