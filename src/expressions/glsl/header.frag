#define F_PI 3.14159
#define F_TAU 6.28318
#define F_E 2.71828
#define F_PHI 1.61803

#define PI vec3(F_PI, F_PI, F_PI)
#define TAU vec3(F_TAU, F_TAU, F_TAU)
#define E vec3(F_E, F_E, F_E)
#define PHI vec3(F_PHI, F_PHI, F_PHI)

precision highp float;

// (x, y) coordinates expected to be varying from [-1, 1]
varying vec2 pos;
// time expected to be varying from [0, 1]
uniform float time;

vec3 expression(vec3 x, vec3 y, vec3 t);

vec3 inv(vec3 v) {
    return -v;
}

vec3 dotp(vec3 a, vec3 b) {
    return vec3(dot(a, b));
}

vec3 logb(vec3 x, vec3 b) {
    return log(x) / log(b);
}

vec3 round(vec3 v) {
    return floor(0.5 + v);
}

vec3 trunc(vec3 v) {
    return vec3(int(v.x), int(v.y), int(v.z));
}

vec3 clip(vec3 v) {
    return max(min(v, 1.0), -1.0);
}

vec3 wrap(vec3 v) {
    return mod(v + 1.0, vec3(3.0)) - 1.0;
}

vec3 ushift(vec3 v) {
    return (v + 1.0) / 2.0;
}

// fac * a + (1 - fac) * b
// TODO: Consider clipping fac to [0, 1]
vec3 blend(vec3 a, vec3 b, vec3 fac) {
    return (fac * a) + ((vec3(1.0) - fac) * b);
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
    vec3 rgb = expression(x, y, t);
    gl_FragColor = vec4(rgb, 1.0);
}