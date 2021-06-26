export function randomRange(min: number, max: number): number {
    if (max < min) {
        throw new Error(`Invalid range [${min}, ${max})`);
    }
    return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
    return Math.floor(randomRange(Math.floor(min), Math.floor(max)));
}

export function randomIntLessThan(max: number): number {
    return randomInt(0, max);
}