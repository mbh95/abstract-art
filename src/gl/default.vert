precision highp float;

attribute vec2 xy_pos;
varying vec2 pos;
void main() {
    pos = xy_pos;
    gl_Position = vec4(xy_pos, 0, 1);
}