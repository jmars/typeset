export interface TypographySettings {
    lineHeight: number;
    fontSize: number;
    fontFamily: string;
    fontStyle: 'italic' | 'normal';
    fontWeight: 'bold' | 'normal';
}
interface LinkTag {
    tag: 'LINK';
    href: string;
    settings: TypographySettings;
}
export interface FontTag {
    tag: 'FONT';
    settings: TypographySettings;
}
export declare type AttributeTag = LinkTag | FontTag;
export interface Attribute {
    start: number;
    length: number;
    tag: AttributeTag;
}
export default class AttributedString {
    static join(strings: AttributedString[]): AttributedString;
    string: string;
    attributes: Attribute[];
    length: number;
    parent?: AttributedString;
    constructor(str: string, attributes: Attribute[]);
    charAt(index: number): string;
    split: () => AttributedString[];
    slice(begin: number, end?: number): AttributedString;
    private splitWhitespace;
}
export {};
