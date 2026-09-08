import Point from './Point';
import TextContainer from './TextContainer';
export default class Span {
    start: Point;
    end: Point;
    container: TextContainer;
    constructor(start: Point, end: Point, container: TextContainer);
}
