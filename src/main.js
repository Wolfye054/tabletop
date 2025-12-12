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
    if (Input.keys['q']) {
        Camera.rotation += 1 * delta_time;
    }
    if (Input.keys['e']) {
        Camera.rotation -= 1 * delta_time;
    }
    let moveX = 0;
    let moveY = 0;

    if (Input.keys['w']) moveY += 1;
    if (Input.keys['s']) moveY -= 1;
    if (Input.keys['d']) moveX += 1;
    if (Input.keys['a']) moveX -= 1;

    // AI Black magic
    if (moveX !== 0 || moveY !== 0) {
        const speed = 500 * delta_time;
        const angle = Camera.rotation;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Rotate movement vector
        const worldX = moveX * cos - moveY * sin;
        const worldY = moveX * sin + moveY * cos;

        Camera.x += worldX * speed;
        Camera.y += worldY * speed;
    }

}

let test1 = new Item('test1', 'https://magicoloriage.com/wp-content/uploads/2025/05/Pixel-art-Creez-un-adorable-cochon-en-quelques-pixels.jpeg', 1080, 1080);
let test2 = new Item('test2', 'https://magicoloriage.com/wp-content/uploads/2025/05/Pixel-art-Creez-un-adorable-cochon-en-quelques-pixels.jpeg', 1080, 1080);
let test3 = new Item('test3', 'https://magicoloriage.com/wp-content/uploads/2025/05/Pixel-art-Creez-un-adorable-cochon-en-quelques-pixels.jpeg', 1080, 1080);
let test4 = new Item('test4', 'https://magicoloriage.com/wp-content/uploads/2025/05/Pixel-art-Creez-un-adorable-cochon-en-quelques-pixels.jpeg', 1080, 1080);

test2.y = 1200;
test3.x = 1200;
test4.y = 1200;
test4.x = 1200;

requestAnimationFrame(gameLoop);