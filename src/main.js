import { Camera } from './Camera.js';
import { Input } from './Input.js';
import { Item } from './Item.js';
import { Card } from './Card.js';

let last_time = 0;

function gameLoop(current_time) {
    const deltaTime = (current_time - last_time) / 1000;
    last_time = current_time;

    update(deltaTime);
    Camera.render();

    requestAnimationFrame(gameLoop);
}

function update(delta_time) {
    if (Input.pressed_keys['h']) {
        console.log('test')
    }
    if (Input.mouse.click && Input.getHovering()) {
        Item.held = Input.getHovering();
    };
    if (!Input.mouse.down) {
        Item.held = null
    }
    Input.handle(delta_time);

    if (Item.held) {
        const [x, y] = Input.mouse.getWorld();
        Item.held.x = x;
        Item.held.y = y;
    }
}

for (let i = 0; i < 400; i++) {
    const item = new Card('./img/card.png', './img/back.png');
    let x_sign = Math.random() > 0.5 ? -1 : 1;
    let y_sign = Math.random() > 0.5 ? -1 : 1;
    let flip = Math.random() > 0.5 ? false : true;

    item.x = Math.floor(Math.random() * 12000) * x_sign;
    item.y = Math.floor(Math.random() * 12000) * y_sign;
    item.rotation = Math.random() * Math.PI * 2;
    if (flip) item.flip();
}

requestAnimationFrame(gameLoop);