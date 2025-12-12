import { Camera } from "./Camera.js";

export class Input {
    static keys = {}
    static mouse = {
        x: 0,
        y: 0,
        down: false,
    }
}

Input.mouse.getWorld = function () {
    //AI Black Magic
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
        -(ry + Camera.y)
    ];
};

window.addEventListener("keydown", e => {
    Input.keys[e.key] = true;
})

window.addEventListener("keyup", e => {
    Input.keys[e.key] = false;
})

Camera.canvas.addEventListener("mousemove", e => {
    const rect = Camera.canvas.getBoundingClientRect();
    Input.mouse.x = e.clientX - rect.left;
    Input.mouse.y = e.clientY - rect.top;
})

Camera.canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomFactor = 1.1;

    if (e.deltaY < 0) Camera.zoom *= zoomFactor;
    else Camera.zoom /= zoomFactor;
});
