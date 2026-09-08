import inside from 'point-in-polygon';
import Point from './Point';
import Span from './Span';
export default class TextContainer {
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
                    spans.push(new Span(new Point(0, y), new Point(this.width, y), this));
                    y += leading;
                }
                this.spans = spans;
                return this.spans;
            }
            else {
                let x = 0;
                let current = new Span(new Point(x, y), new Point(x, y), this);
                while (y <= this.height) {
                    while (x <= this.width) {
                        for (const exclusion of this.exclusions) {
                            const pt = [x, y];
                            if (inside(pt, exclusion.layout())) {
                                if (current.start.x < x - 1) {
                                    spans.push(current);
                                    current = new Span(new Point(x, y), new Point(x, y), this);
                                }
                                current.start = new Point(x + 1, y);
                            }
                        }
                        current.end = new Point(x, y);
                        x++;
                    }
                    y += leading;
                    x = 0;
                    spans.push(current);
                    current = new Span(new Point(0, y), new Point(0, y), this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dENvbnRhaW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZXh0Q29udGFpbmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLGtCQUFrQixDQUFDO0FBRXRDLE9BQU8sS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUM1QixPQUFPLElBQUksTUFBTSxRQUFRLENBQUM7QUFFMUIsTUFBTSxDQUFDLE9BQU8sT0FBTyxhQUFhO0lBUWhDLFlBQ0UsS0FBYSxFQUNiLE1BQWMsRUFDZCxDQUFTLEVBQ1QsQ0FBUyxFQUNULGFBQTBCLEVBQUU7UUFQdkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQXNCbkIsbUJBQWMsR0FBRyxVQUV0QixPQUFlO1lBRWYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ25CO1lBQ0QsTUFBTSxLQUFLLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUMzQixPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUN2QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3RFLENBQUMsSUFBSSxPQUFPLENBQUM7aUJBQ2Q7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNuQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDL0QsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDdkIsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFDdEIsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFOzRCQUN2QyxNQUFNLEVBQUUsR0FBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3BDLElBQUksTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtnQ0FDbEMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29DQUMzQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29DQUNwQixPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztpQ0FDNUQ7Z0NBQ0QsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzZCQUNyQzt5QkFDRjt3QkFDRCxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsQ0FBQyxFQUFFLENBQUM7cUJBQ0w7b0JBQ0QsQ0FBQyxJQUFJLE9BQU8sQ0FBQztvQkFDYixDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNOLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3BCLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUM1RDtnQkFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNuQjtRQUNILENBQUMsQ0FBQztRQXZEQSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLFlBQVksQ0FBQyxTQUFvQjtRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0NBNkNGIn0=