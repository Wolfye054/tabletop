import { Item } from "./Item.js"

export class Card extends Item {

    constructor(f_image, b_image) {
        super(b_image)
        this.image.src = f_image
        this.front = f_image
        this.back = b_image
        this.flipped = false;
    }

    flip() {
        if (this.flipped) {
            this.image.src = this.front
        }
        else {
            this.image.src = this.back
        }

        this.flipped = !this.flipped;
    }
}