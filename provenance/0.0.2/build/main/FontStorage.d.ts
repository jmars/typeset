import * as opentype from 'opentype.js';
import { TypographySettings } from './AttributedString';
declare class FontStorage {
    private fonts;
    private cache;
    constructor();
    getFont(settings: TypographySettings): opentype.Font;
    registerFont(name: string, font: () => opentype.Font): boolean;
}
declare const _default: FontStorage;
export default _default;
