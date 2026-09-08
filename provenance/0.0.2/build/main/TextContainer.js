"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_in_polygon_1 = __importDefault(require("point-in-polygon"));
const Point_1 = __importDefault(require("./Point"));
const Span_1 = __importDefault(require("./Span"));
class TextContainer {
    constructor(width, height, x, y, exclusions = []) {
        this.spans = [];
        this.calculateSpans = function (leading) {
            if (this.spans.length) {
                return this.spans;
            }
            const spans = [];
            let y = leading / 2;
            if (!this.exclusions.length) {
                while (y <= this.height) {
                    spans.push(new Span_1.default(new Point_1.default(0, y), new Point_1.default(this.width, y), this));
                    y += leading;
                }
                this.spans = spans;
                return this.spans;
            }
            else {
                let x = 0;
                let current = new Span_1.default(new Point_1.default(x, y), new Point_1.default(x, y), this);
                while (y <= this.height) {
                    while (x <= this.width) {
                        for (const exclusion of this.exclusions) {
                            const pt = [x, y];
                            if (point_in_polygon_1.default(pt, exclusion.layout())) {
                                if (current.start.x < x - 1) {
                                    spans.push(current);
                                    current = new Span_1.default(new Point_1.default(x, y), new Point_1.default(x, y), this);
                                }
                                current.start = new Point_1.default(x + 1, y);
                            }
                        }
                        current.end = new Point_1.default(x, y);
                        x++;
                    }
                    y += leading;
                    x = 0;
                    spans.push(current);
                    current = new Span_1.default(new Point_1.default(0, y), new Point_1.default(0, y), this);
                }
                this.spans = spans.filter(({ start, end }) => start.x < end.x);
                return this.spans;
            }
        };
        this.exclusions = exclusions;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    addExclusion(exclusion) {
        this.exclusions = [...this.exclusions, exclusion];
        exclusion.layout();
        this.spans = [];
    }
}
exports.default = TextContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dENvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZXh0Q29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0VBQXNDO0FBRXRDLG9EQUE0QjtBQUM1QixrREFBMEI7QUFFMUIsTUFBcUIsYUFBYTtJQVFoQyxZQUNFLEtBQWEsRUFDYixNQUFjLEVBQ2QsQ0FBUyxFQUNULENBQVMsRUFDVCxhQUEwQixFQUFFO1FBUHZCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFzQm5CLG1CQUFjLEdBQUcsVUFFdEIsT0FBZTtZQUVmLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNuQjtZQUNELE1BQU0sS0FBSyxHQUFXLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtnQkFDM0IsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQUksQ0FBQyxJQUFJLGVBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0RSxDQUFDLElBQUksT0FBTyxDQUFDO2lCQUNkO2dCQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDbkI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLElBQUksT0FBTyxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksZUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMs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