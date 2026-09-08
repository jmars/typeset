import { Exclusion } from './Exclusion';
import Span from './Span';
export default class TextContainer {
    exclusions: Exclusion[];
    width: number;
    height: number;
    x: number;
    y: number;
    spans: Span[];
    constructor(width: number, height: number, x: number, y: number, exclusions?: Exclusion[]);
    addExclusion(exclusion: Exclusion): void;
    calculateSpans: (this: TextContainer, leading: number) => Span[];
}
