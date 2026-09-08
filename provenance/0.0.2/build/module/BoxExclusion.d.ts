import { Exclusion } from './Exclusion';
export default class BoxExclusion implements Exclusion {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    layout(): number[][];
    move(x: number, y: number): BoxExclusion;
}
