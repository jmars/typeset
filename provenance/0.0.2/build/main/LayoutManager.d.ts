import AttributedString from './AttributedString';
import { Exclusion } from './Exclusion';
import PositionedItem from './PositionedItem';
import TextContainer from './TextContainer';
export default class LayoutManager {
    text: AttributedString;
    containers: TextContainer[];
    positioned: PositionedItem[];
    exclusions: Exclusion[];
    processed: number;
    constructor(text: AttributedString, containers: TextContainer[], exclusions?: Exclusion[]);
    layout(justify?: boolean, hyphenate?: boolean): PositionedItem[];
}
