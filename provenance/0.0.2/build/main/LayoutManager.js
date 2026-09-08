"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tex_linebreak_1 = require("tex-linebreak");
const AttributedString_1 = __importDefault(require("./AttributedString"));
const FontStorage_1 = __importDefault(require("./FontStorage"));
const PositionedItem_1 = __importDefault(require("./PositionedItem"));
function isFontTag(value) {
    return value !== null && value !== undefined;
}
const getLeading = (str) => {
    const fontAttrs = str.attributes
        .map(({ tag }) => tag)
        .filter(isFontTag);
    return Math.max(...fontAttrs.map(tag => tag.settings.lineHeight));
};
const getSettings = (str) => {
    const fontAttrs = str.attributes
        .map(({ tag }) => tag)
        .filter(isFontTag);
    if (!fontAttrs.length) {
        throw new Error(`String with no font setting: ${str.string}`);
    }
    return fontAttrs[0].settings;
};
const MAX_COST = 1000;
const MIN_COST = -1000;
function forcedBreak() {
    return {
        cost: MIN_COST,
        flagged: false,
        text: new AttributedString_1.default('', []),
        type: 'penalty',
        width: 0
    };
}
const defaultOptions = {
    adjacentLooseTightPenalty: 0,
    doubleHyphenPenalty: 0,
    initialMaxAdjustmentRatio: 1,
    maxAdjustmentRatio: Infinity
};
function layoutItemsFromString(s, measureFn, hyphenateFn) {
    const items = [];
    const splits = s.split().filter(w => w.length > 0);
    const spaceWidth = measureFn(new AttributedString_1.default(' ', []));
    const hyphenWidth = measureFn(new AttributedString_1.default('-', []));
    const isSpace = (word) => /\s/.test(word.charAt(0));
    // TODO: this is set up for ragged right
    // Justify is the below shrink + stretch spaceWidth * 1.5
    // const shrink = Math.max(0, spaceWidth - 2);
    splits.forEach(w => {
        if (isSpace(w)) {
            if (w.string === '\n') {
                items.push({
                    shrink: 0,
                    stretch: MAX_COST,
                    text: new AttributedString_1.default('', []),
                    type: 'glue',
                    width: 0
                });
                items.push(forcedBreak());
                return;
            }
            const g = {
                shrink: 0,
                stretch: spaceWidth / 3,
                text: w,
                type: 'glue',
                width: spaceWidth
            };
            items.push(g);
            return;
        }
        if (hyphenateFn) {
            const chunks = hyphenateFn(w);
            chunks.forEach((c, i) => {
                const b = { type: 'box', width: measureFn(c), text: c };
                items.push(b);
                if (i < chunks.length - 1) {
                    const hyphen = {
                        cost: 10,
                        flagged: true,
                        text: new AttributedString_1.default('-', c.attributes),
                        type: 'penalty',
                        width: hyphenWidth
                    };
                    items.push(hyphen);
                }
            });
        }
        else {
            const b = { type: 'box', width: measureFn(w), text: w };
            items.push(b);
        }
    });
    items.push({
        shrink: 0,
        stretch: MAX_COST,
        text: new AttributedString_1.default('', []),
        type: 'glue',
        width: 0
    });
    items.push(forcedBreak());
    return items;
}
const joinAdjacent = (positioned) => {
    const reduced = positioned.reduce((acc, p) => {
        const last = acc[acc.length - 1];
        if (!last) {
            return [...acc, p];
        }
        if (p.position.xOffset === last.position.xOffset + last.position.width) {
            const joined = AttributedString_1.default.join([last.text.text, p.text.text]);
            joined.parent = last.text.text.parent;
            return [
                ...acc.slice(0, -1),
                new PositionedItem_1.default(
                // tslint:disable-next-line: no-object-literal-type-assertion
                {
                    text: joined
                }, Object.assign({}, last.position, { width: last.position.width + p.position.width }))
            ];
        }
        return [...acc, p];
    }, []);
    return reduced;
};
const raggedRight = (positioned, spaceWidth) => {
    for (let i = 0; i < positioned.length; i++) {
        const current = positioned[i];
        const next = positioned[i + 1];
        if (!next) {
            break;
        }
        if ((current.text.text.parent &&
            current.text.text.parent === next.text.text.parent &&
            current.position.line === next.position.line) ||
            next.text.text.string === '-') {
            next.position.xOffset = current.position.xOffset + current.position.width;
            continue;
        }
        if (next.position.xOffset === 0) {
            continue;
        }
        if (next.position.xOffset -
            current.position.xOffset -
            current.position.width >
            spaceWidth) {
            next.position.xOffset =
                current.position.xOffset + current.position.width + spaceWidth;
        }
    }
    return joinAdjacent(positioned);
};
const makeHyphenator = (() => {
    let dictionary = null;
    return () => {
        if (!dictionary) {
            dictionary = tex_linebreak_1.createHyphenator(require('hyphenation.en-gb'));
        }
        return dictionary;
    };
})();
class LayoutManager {
    constructor(text, containers, exclusions = []) {
        this.containers = [];
        this.positioned = [];
        this.exclusions = [];
        this.processed = 0;
        this.text = text;
        this.containers = containers;
        this.exclusions = exclusions;
    }
    layout(justify = false, hyphenate = false) {
        let spans = [];
        let hyphenator;
        if (hyphenate) {
            hyphenator = makeHyphenator();
        }
        const leading = getLeading(this.text);
        for (const container of this.containers) {
            for (const exclusion of this.exclusions) {
                container.addExclusion(exclusion.move(-container.x, -container.y));
            }
            spans = spans.concat(container.calculateSpans(leading));
        }
        const measure = (text) => {
            const settings = getSettings(text.attributes.length ? text : this.text);
            const font = FontStorage_1.default.getFont(settings);
            return font.getAdvanceWidth(text.string, settings.fontSize);
        };
        const hyphenateFn = (text) => {
            const chunks = hyphenator(text.string);
            const stringies = [];
            let i = 0;
            for (const chunk of chunks) {
                const slice = text.slice(i, i + chunk.length);
                slice.parent = text;
                // TODO: use rope datastructure here to reduce memory pressure
                stringies.push(slice);
                i += chunk.length;
            }
            return stringies;
        };
        const items = layoutItemsFromString(this.text, measure, hyphenate ? hyphenateFn : undefined);
        const widths = spans.map((span) => span.end.x - span.start.x);
        const breakpoints = tex_linebreak_1.breakLines(items, widths, defaultOptions);
        const positioned = tex_linebreak_1.positionItems(items, widths, breakpoints);
        const spaceWidth = measure(new AttributedString_1.default(' ', []));
        this.processed = positioned
            .filter(p => !isNaN(p.xOffset))
            .map(p => items[p.item].text)
            .reduce((acc, t) => acc + t.length, 0);
        this.positioned = positioned
            .filter(p => !isNaN(p.xOffset) && spans[p.line])
            .map(p => {
            const item = new PositionedItem_1.default(items[p.item], Object.assign({}, p, { xOffset: spans[p.line].start.x + p.xOffset }));
            return item;
        });
        if (!justify) {
            raggedRight(this.positioned, spaceWidth);
        }
        return this.positioned;
    }
}
exports.default = LayoutManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXlvdXRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaURBS3VCO0FBQ3ZCLDBFQUE2RTtBQUU3RSxnRUFBd0M7QUFDeEMsc0VBQThDO0FBSTlDLFNBQVMsU0FBUyxDQUFDLEtBQTBCO0lBQzNDLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDO0FBQy9DLENBQUM7QUFFRCxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQXFCLEVBQUUsRUFBRTtJQUMzQyxNQUFNLFNBQVMsR0FBYyxHQUFHLENBQUMsVUFBVTtTQUN4QyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDckIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQyxDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFxQixFQUFFLEVBQUU7SUFDNUMsTUFBTSxTQUFTLEdBQWMsR0FBRyxDQUFDLFVBQVU7U0FDeEMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtRQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUMvRDtJQUNELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUMvQixDQUFDLENBQUM7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