const canvas = document.querySelector('canvas');
const Input = {};
Input.pressed_keys = {};
Input.held_keys = {};
Input.mouse = {
    x: 0,
    y: 0,
    click: false,
    down: false,
    scroll: 0,
}

Input.update = function () {
    // Update press inputs to be false
    Object.keys(Input.pressed_keys).forEach(key => {
        Input.pressed_keys[key] = false;
    })
    Input.mouse.click = false;
    Input.mouse.scroll = 0;
}

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

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    Input.mouse.x = e.clientX - rect.left;
    Input.mouse.y = e.clientY - rect.top;
})

canvas.addEventListener("wheel", e => {
    e.preventDefault();

    Input.mouse.scroll = e.deltaY < 0 ? -1 : 1;
});

export { Input };