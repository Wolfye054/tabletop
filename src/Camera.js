import { Item } from './Item.js';
import { Input } from './Input.js';

export class Camera {
    static x = 0;
    static y = 0;
    static rotation = 0;
    static zoom = 1;

    static canvas = document.querySelector('canvas');
    static context = Camera.canvas.getContext('2d');

    static render() {
        const ctx = Camera.context;

        ctx.clearRect(0, 0, Camera.canvas.width, Camera.canvas.height);

        ctx.save();

        // Move origin to screen center
        ctx.translate(Camera.canvas.width / 2, Camera.canvas.height / 2);

        // Camera zoom + rotation
        ctx.scale(Camera.zoom, Camera.zoom);
        ctx.rotate(Camera.rotation);

        // Move world relative to camera
        ctx.translate(-Camera.x, Camera.y);

        // Draw items
        Item.list.forEach(item => {
            ctx.save();

            // Move origin to item center
            ctx.translate(item.x, -item.y);

            // Rotate item (RADIANS)
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

        const hovering = Input.getHovering()
        if (hovering) {
            ctx.save();
            ctx.translate(hovering.x, -hovering.y);
            ctx.rotate(hovering.rotation);
            ctx.strokeStyle = Item.held ? "#0000FF" : "#FFFF00";
            ctx.lineWidth = 8 / Camera.zoom;
            ctx.translate(-hovering.x, -hovering.y)
            ctx.strokeRect(hovering.x - hovering.width / 2, hovering.y - hovering.height / 2, hovering.width, hovering.height)
            ctx.restore();
        }
        ctx.restore();
    }

}

function resize() {
    Camera.canvas.width = window.innerWidth;
    Camera.canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

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