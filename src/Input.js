import { Camera } from "./Camera.js";
import { Item } from "./Item.js";

let hovering = null;

export class Input {
    static held_keys = {}
    static pressed_keys = {}
    static mouse = {
        x: 0,
        y: 0,
        down: false,
        click: false
    }

    static getHovering() {
        return hovering;
    }

    static handle(delta_time) {
        if (Input.held_keys['q']) {
            if (Item.held)
                Item.held.rotation -= 5 * delta_time;
            else
                Camera.rotation += 2 * delta_time;
        }
        if (Input.held_keys['e']) {
            if (Item.held)
                Item.held.rotation += 5 * delta_time;
            else
                Camera.rotation -= 2 * delta_time;
        }
        let moveX = 0;
        let moveY = 0;

        if (Input.held_keys['w']) moveY += 1;
        if (Input.held_keys['s']) moveY -= 1;
        if (Input.held_keys['d']) moveX += 1;
        if (Input.held_keys['a']) moveX -= 1;

        // AI
        if (moveX !== 0 || moveY !== 0) {
            const speed = 500 * delta_time;
            const angle = Camera.rotation;

            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Rotate movement vector
            const worldX = moveX * cos - moveY * sin;
            const worldY = moveX * sin + moveY * cos;

            Camera.x += worldX * speed / Camera.zoom;
            Camera.y += worldY * speed / Camera.zoom;
        }

        // Find card being hovered over
        hovering = null;
        Item.list.forEach(item => {
            if (isHovering(item)) hovering = item;
        })

        // Update press inputs to be false
        Object.keys(Input.pressed_keys).forEach(key => {
            Input.pressed_keys[key] = false;
        })
        Input.mouse.click = false;
    }


}

function isHovering(item) {
    //AI
    const [mx, my] = Input.mouse.getWorld();

    const dx = mx - item.x;
    const dy = my - item.y;

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

Input.mouse.getWorld = function () {
    //AI
    const sx = Input.mouse.x;
    const sy = Input.mouse.y;

    // screen -> centered camera local
    let x = sx - Camera.canvas.width / 2;
    let y = sy - Camera.canvas.height / 2;

    // undo zoom
    x /= Camera.zoom;
    y /= Camera.zoom;

    // undo rotation
    const cos = Math.cos(-Camera.rotation);
    const sin = Math.sin(-Camera.rotation);

    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos;

    // camera local -> world
    return [
        rx + Camera.x,
        -ry + Camera.y
    ];
};

window.addEventListener("keydown", e => {
    Input.held_keys[e.key] = true;
    Input.pressed_keys[e.key] = true;
})

window.addEventListener("keyup", e => {
    Input.held_keys[e.key] = false;
})

window.addEventListener("mousedown", e => {
    Input.mouse.click = true;
    Input.mouse.down = true;
})

window.addEventListener('mouseup', e => {
    Input.mouse.down = false;
})
