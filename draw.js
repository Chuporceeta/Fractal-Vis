function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function draw(gl, programInfo, canvas, t, view) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);


    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0]),
        gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);


    gl.useProgram(programInfo.program);

    gl.uniform1f(programInfo.uniformLocations.zoom, view.zoom);
    gl.uniform2f(programInfo.uniformLocations.center, view.mouseX, view.mouseY);
    gl.uniform2f(programInfo.uniformLocations.dims, canvas.width, canvas.height);

    const cx = 0.7885 * Math.cos(t),
          cy = 0.7885 * Math.sin(t);
    gl.uniform2f(programInfo.uniformLocations.c, cx, cy);
    const R = Math.ceil(0.5 + Math.sqrt(1 + 4*Math.sqrt(cx*cx + cy*cy))/2);
    gl.uniform1f( programInfo.uniformLocations.R, 2*R);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function main() {
    const canvas = document.getElementById("gl-canvas");
    const vsSource = document.getElementById("vertex-shader").textContent;
    const fsSource = document.getElementById("fragment-shader").textContent;
    const gl = canvas.getContext("webgl");

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            dims: gl.getUniformLocation(shaderProgram, "uDims"),
            zoom: gl.getUniformLocation(shaderProgram, "uZoom"),
            center: gl.getUniformLocation(shaderProgram, "uCenter"),
            c: gl.getUniformLocation(shaderProgram, "c"),
            R: gl.getUniformLocation(shaderProgram, "R"),
        }
    }

    let zoom = 1.0, mouseX, mouseY;
    let view = {
        zoom: zoom,
        mouseX: canvas.width / 2,
        mouseY: canvas.height / 2,
    }
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = canvas.height - e.clientY;
        // console.log(`${mouseX}/${canvas.width}, ${mouseY}/${canvas.height}`);
    })
    document.addEventListener("wheel", (e) => {
        zoom = Math.max(0.01, zoom - 0.001 * e.deltaY);
        view = {
            zoom: zoom,
            mouseX: mouseX,
            mouseY: mouseY,
        }
    })

    let t = 0, paused = false;
    document.addEventListener("click", () => {paused = !paused;})

    let then = 0;
    function render(now) {
        if (!paused)
            t += now - then;
        then = now;
        draw(gl, programInfo, canvas, t/4000, view);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render)

}
main();