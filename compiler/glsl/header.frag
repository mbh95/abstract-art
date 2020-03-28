precision highp float;

varying vec2 pos;
uniform float time;

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