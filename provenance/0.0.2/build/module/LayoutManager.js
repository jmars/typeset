import { breakLines, createHyphenator, positionItems } from 'tex-linebreak';
import AttributedString from './AttributedString';
import FontStorage from './FontStorage';
import PositionedItem from './PositionedItem';
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
        text: new AttributedString('', []),
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
    const spaceWidth = measureFn(new AttributedString(' ', []));
    const hyphenWidth = measureFn(new AttributedString('-', []));
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
                    text: new AttributedString('', []),
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
                        text: new AttributedString('-', c.attributes),
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
        text: new AttributedString('', []),
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
            const joined = AttributedString.join([last.text.text, p.text.text]);
            joined.parent = last.text.text.parent;
            return [
                ...acc.slice(0, -1),
                new PositionedItem(
                // tslint:disable-next-line: no-object-literal-type-assertion
                {
                    text: joined
                }, {
                    ...last.position,
                    width: last.position.width + p.position.width
                })
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
            dictionary = createHyphenator(require('hyphenation.en-gb'));
        }
        return dictionary;
    };
})();
export default class LayoutManager {
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
            const font = FontStorage.getFont(settings);
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
        const breakpoints = breakLines(items, widths, defaultOptions);
        const positioned = positionItems(items, widths, breakpoints);
        const spaceWidth = measure(new AttributedString(' ', []));
        this.processed = positioned
            .filter(p => !isNaN(p.xOffset))
            .map(p => items[p.item].text)
            .reduce((acc, t) => acc + t.length, 0);
        this.positioned = positioned
            .filter(p => !isNaN(p.xOffset) && spans[p.line])
            .map(p => {
            const item = new PositionedItem(items[p.item], {
                ...p,
                xOffset: spans[p.line].start.x + p.xOffset
            });
            return item;
        });
        if (!justify) {
            raggedRight(this.positioned, spaceWidth);
        }
        return this.positioned;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9MYXlvdXRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFFZCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLGdCQUEyQyxNQUFNLG9CQUFvQixDQUFDO0FBRTdFLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLGNBQWMsTUFBTSxrQkFBa0IsQ0FBQztBQUk5QyxTQUFTLFNBQVMsQ0FBQyxLQUEwQjtJQUMzQyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFxQixFQUFFLEVBQUU7SUFDM0MsTUFBTSxTQUFTLEdBQWMsR0FBRyxDQUFDLFVBQVU7U0FDeEMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLENBQUMsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBcUIsRUFBRSxFQUFFO0lBQzVDLE1BQU0sU0FBUyxHQUFjLEdBQUcsQ0FBQyxVQUFVO1NBQ3hDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNyQixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDckIsTUFBTSxJQUFJLEtBQUssQ0FB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