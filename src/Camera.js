import { Item } from './Item.js';

export class Camera {
    static x = 0;
    static y = 0;
    static rotation = 0;
    static zoom = 1;

    static canvas = document.querySelector('canvas');
    static context = Camera.canvas.getContext('2d');

    static render() {
        Camera.context.clearRect(0, 0, Camera.canvas.width, Camera.canvas.height);

        Camera.context.save()

        Camera.context.translate(Camera.canvas.width / 2, Camera.canvas.height / 2);
        Camera.context.scale(Camera.zoom, Camera.zoom);
        Camera.context.rotate(Camera.rotation)

        Camera.context.translate(-Camera.x, Camera.y)

        // Offset image by image.width/height to make center origin
        Item.list.forEach(item => {
            Camera.context.drawImage(item.image, item.x - (item.width / 2), -item.y - (item.height / 2));
        })

        Camera.context.restore();
    }
}

function resize() {
    Camera.canvas.width = window.innerWidth;
    Camera.canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);