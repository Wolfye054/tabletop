export class Item {
    static list = [];
    static held = null

    constructor(name, imageURL) {
        this.name = name;
        this.image = document.createElement('img');
        this.image.src = imageURL;
        this.x = 0;
        this.y = 0;
        this.width = this.image.naturalWidth;
        this.height = this.image.naturalHeight;
        this.rotation = 0;

        Item.list.push(this)
    }
}