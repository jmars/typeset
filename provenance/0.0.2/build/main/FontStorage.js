"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FontStorage {
    constructor() {
        this.cache = {};
        this.fonts = {};
    }
    getFont(settings) {
        const style = settings.fontStyle === 'italic'
            ? settings.fontStyle
            : settings.fontWeight;
        const name = `${settings.fontFamily}${style ? '-' + style[0].toUpperCase() + style.slice(1) : ''}`;
        if (name in this.fonts) {
            if (name in this.cache) {
                return this.cache[name];
            }
            this.cache[name] = this.fonts[name]();
            return this.cache[name];
        }
        else {
            throw new Error(`Could not find font with name: ${name}`);
        }
    }
    registerFont(name, font) {
        if (name in this.fonts) {
            throw new Error(`Font ${name} already registered`);
        }
        this.fonts[name] = font;
        return true;
    }
}
exports.default = new FontStorage();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9udFN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvRm9udFN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxNQUFNLFdBQVc7SUFJZjtRQUZRLFVBQUssR0FBa0MsRUFBRSxDQUFDO1FBR2hELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxPQUFPLENBQUMsUUFBNEI7UUFDekMsTUFBTSxLQUFLLEdBQ1QsUUFBUSxDQUFDLFNBQVMsS0FBSyxRQUFRO1lBQzdCLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUztZQUNwQixDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxVQUFVLEdBQ2pDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUMxRCxFQUFFLENBQUM7UUFDSCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3RCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6QjtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUM7SUFFTSxZQUFZLENBQUMsSUFBWSxFQUFFLElBQXlCO1FBQ3pELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUkscUJBQXFCLENBQUMsQ0FBQztTQUNwRDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxXQUFXLEVBQUUsQ0FBQyJ9