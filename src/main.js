import { Camera } from './Camera.js';
import { Input } from './Input.js';
import { Item } from './Item.js';

let last_time = 0;

function gameLoop(current_time) {
    const deltaTime = (current_time - last_time) / 1000;
    last_time = current_time;

    update(deltaTime);
    Camera.render();

    requestAnimationFrame(gameLoop);
}

function update(delta_time) {
    Input.handle(delta_time);
}

let test1 = new Item('test1', './img/card.png');
let test2 = new Item('test2', './img/card.png');
let test3 = new Item('test3', './img/card.png');
let test4 = new Item('test4', './img/card.png');

test2.y = 1200;
test3.x = 1200;
test4.y = 1200;
test4.x = 1200;
test1.rotation = 2;
// test2.rotation = 2;
// test3.rotation = 2;
test4.rotation = -2;

requestAnimationFrame(gameLoop);