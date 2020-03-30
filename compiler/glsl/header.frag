precision highp float;

varying vec2 pos;
uniform float time;

vec3 expression(vec3 x, vec3 y, vec3 t);

vec3 round(vec3 v) {
    return floor(0.5 + v);
}

vec3 ushift(vec3 v) {
    return (v + 1.0) / 2.0;
}

vec3 rgb(vec3 r, vec3 g, vec3 b) {
    return vec3(r.x, g.x, b.x);
}

vec3 bw(vec3 rgb) {
    return vec3(0.3 * rgb.x + 0.59 * rgb.y + 0.11 * rgb.z);
}

void main() {
    vec3 x = vec3(pos.x);
    vec3 y = vec3(pos.y);
    vec3 t = vec3(time, time, time);
    vec3 res = expression(x, y, t);
    // TODO: Explore other ways to map R3->RGB
    vec3 rgb = (res + 1.0) / 2.0;
    gl_FragColor = vec4(rgb, 1.0);
}