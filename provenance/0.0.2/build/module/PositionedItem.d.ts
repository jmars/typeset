import { LayoutItem, TexItem } from 'tex-linebreak';
export default class PositionedItem {
    text: TexItem;
    position: LayoutItem;
    constructor(text: TexItem, position: LayoutItem);
}
