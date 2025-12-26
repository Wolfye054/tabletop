import { Input } from "./input.js";

const CARD_IMG_BASE = new URL('../img/cards/', import.meta.url);
let last_time = 0;
let prev_id = 0;
let player = null;
let hovering = null;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const camera = {};
const game = {};

const start = function () {
    camera.x = 0;
    camera.y = 0;
    camera.rotation = 0;
    camera.zoom = 1;

    game.items = [];
    game.players = [];
    player = createPlayer('test');

    //TEST
    createCard(new URL(getRandomCard() + '.png', CARD_IMG_BASE).href, new URL('back.png', CARD_IMG_BASE));
    requestAnimationFrame(loop);
}

const loop = function (current_time) {
    const delta_time = (current_time - last_time) / 100;
    last_time = current_time;

    update(delta_time);
    render();

    requestAnimationFrame(loop);
}

const update = function (delta_time) {
    //Update hovering
    hovering = null;
    game.items.forEach(item => {
        if (isHovering(item)) hovering = item;
    })

    handleInput(delta_time);
    Input.update();
}

const render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Move origin to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // camera zoom + rotation
    ctx.scale(camera.zoom, camera.zoom);
    ctx.rotate(camera.rotation);

    // Move world relative to camera
    ctx.translate(-camera.x, camera.y);

    // Draw game items
    game.items.forEach(item => {
        ctx.save();

        // Move origin to item
        ctx.translate(item.x, -item.y);

        // Rotate item
        ctx.rotate(item.rotation);

        // Draw centered
        ctx.drawImage(
            item.image,
            -item.width / 2,
            -item.height / 2,
            item.width,
            item.height
        );

        ctx.restore();
    });

    //TODO
    // draw hand

    // draw hovering/holding outline
    if (hovering) {
        ctx.save();
        ctx.translate(hovering.x, -hovering.y);
        ctx.rotate(hovering.rotation);
        ctx.strokeStyle = player.held ? "#0000FF" : "#FFFF00";
        ctx.lineWidth = 6 / camera.zoom;
        ctx.translate(-hovering.x, -hovering.y)
        ctx.strokeRect(hovering.x - hovering.width / 2, hovering.y - hovering.height / 2, hovering.width, hovering.height)
        ctx.restore();
    }

    ctx.restore();
}

const createPlayer = function (name) {
    const player = {};
    player.name = name;
    player.hand = [];
    player.held = null;
    player.id = ++prev_id;

    game.players.push(player);
    return player;
}

const createItem = function (image) {
    const item = {};
    item.type = 'item';

    item.image = document.createElement('img');
    item.image.src = image;
    item.image.onload = function () {
        item.width = item.image.naturalWidth;
        item.height = item.image.naturalHeight;
    }

    item.x = 0;
    item.y = 0;
    item.rotation = 0;

    game.items.push(item);
    return item;
}

const createCard = function (front, back) {
    const card = createItem(front);
    card.type = 'card';
    card.front = front;
    card.back = back;
    card.hidden = false;
    return card;
}

const flipCard = function (card) {
    if (card.hidden) card.image.src = card.front;
    else card.image.src = card.back;
    card.hidden = !card.hidden;
}

const draw = function (item) {
    if (item.type == 'deck') {
        //TODO
    }
    else if (item.type == 'card') {
        // remove card from game items.
        const index = game.items.indexOf(item);
        game.items.splice(index, 1);

        player.hand.push(item);
    }
}

const getWorld = function () {
    const sx = Input.mouse.x;
    const sy = Input.mouse.y;

    // screen -> centered camera local
    let x = sx - canvas.width / 2;
    let y = sy - canvas.height / 2;

    // undo zoom
    x /= camera.zoom;
    y /= camera.zoom;

    // undo rotation
    const cos = Math.cos(-camera.rotation);
    const sin = Math.sin(-camera.rotation);

    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos;

    // camera local -> world
    return {
        x: rx + camera.x,
        y: -ry + camera.y
    };
};

const isHovering = function (item) {
    const { x, y } = getWorld();

    const dx = x - item.x;
    const dy = y - item.y;

    const cos = Math.cos(item.rotation);
    const sin = Math.sin(item.rotation);

    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;

    return (
        localX >= -item.width / 2 &&
        localX <= item.width / 2 &&
        localY >= -item.height / 2 &&
        localY <= item.height / 2
    );
}

const handleInput = function (delta_time) {
    if (Input.pressed_keys['q']) {
        if (hovering)
            hovering.rotation -= 0.785398;
        else
            camera.rotation += 0.785398;
    }
    if (Input.pressed_keys['e']) {
        if (hovering)
            hovering.rotation += 0.785398;
        else
            camera.rotation -= 0.785398;
    }
    if (Input.mouse.scroll) {
        const zoomFactor = 1.1;

        if (Input.mouse.scroll < 0) camera.zoom *= zoomFactor;
        else camera.zoom /= zoomFactor;
    }

    let moveX = 0;
    let moveY = 0;

    if (Input.held_keys['w']) moveY += 1;
    if (Input.held_keys['s']) moveY -= 1;
    if (Input.held_keys['d']) moveX += 1;
    if (Input.held_keys['a']) moveX -= 1;

    if (moveX !== 0 || moveY !== 0) {
        const speed = 250 * delta_time;
        const angle = camera.rotation;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Rotate movement vector
        const worldX = moveX * cos - moveY * sin;
        const worldY = moveX * sin + moveY * cos;

        camera.x += worldX * speed / camera.zoom;
        camera.y += worldY * speed / camera.zoom;
    }

    if (Input.mouse.click && hovering) {
        player.held = hovering;
        const index = game.items.indexOf(player.held);
        if (index !== -1) {
            game.items.splice(index, 1); // remove
            game.items.push(player.held);       // add to top
        }
    };
    if (!Input.mouse.down) {
        player.held = null
    }
    if (player.held) {
        const { x, y } = getWorld();
        player.held.x = x;
        player.held.y = y;
    }

    if (Input.pressed_keys['f'] && hovering && hovering.type == 'card') {
        flipCard(hovering);
    }

    //TEST
    if (Input.pressed_keys['c']) {
        const card = createCard(new URL(getRandomCard() + '.png', CARD_IMG_BASE).href, new URL('back.png', CARD_IMG_BASE));
        const mouse = getWorld();

        card.x = mouse.x;
        card.y = mouse.y;
    }
    if (Input.pressed_keys['t']) {
        console.log(game);
    }
}

// returns string, example: "6_of_hearts"
const getRandomCard = function () {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];

    return rank + '_of_' + suit;
}

export { start };