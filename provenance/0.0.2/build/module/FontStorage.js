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
export default new FontStorage();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9udFN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvRm9udFN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxXQUFXO0lBSWY7UUFGUSxVQUFLLEdBQWtDLEVBQUUsQ0FBQztRQUdoRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU0sT0FBTyxDQUFDLFFBQTRCO1FBQ3pDLE1BQU0sS0FBSyxHQUNULFFBQVEsQ0FBQyxTQUFTLEtBQUssUUFBUTtZQUM3QixDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVM7WUFDcEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsVUFBVSxHQUNqQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDMUQsRUFBRSxDQUFDO1FBQ0gsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN0QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDekI7WUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUN0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLElBQUksRUFBRSxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0lBRU0sWUFBWSxDQUFDLElBQVksRUFBRSxJQUF5QjtRQUN6RCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLHFCQUFxQixDQUFDLENBQUM7U0FDcEQ7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQUVELGVBQWUsSUFBSSxXQUFXLEVBQUUsQ0FBQyJ9