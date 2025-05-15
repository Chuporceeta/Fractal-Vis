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
    gl.uniform2f(programInfo.uniformLocations.offset, view.xPanOffset, view.yPanOffset);
    gl.uniform2f(programInfo.uniformLocations.zoomOffset, view.xZoomOffset, view.yZoomOffset);
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
            zoomOffset: gl.getUniformLocation(shaderProgram, "uZoomOffset"),
            offset: gl.getUniformLocation(shaderProgram, "uOffset"),
            c: gl.getUniformLocation(shaderProgram, "c"),
            R: gl.getUniformLocation(shaderProgram, "R"),
        }
    };

    let view = {
        zoom: 1.0,
        xPanOffset: 0,
        yPanOffset: 0,
        xMouseOffset: 0,
        yMouseOffset: 0,
        xZoomOffset: 0,
        yZoomOffset: 0,
    };

    let middleMouseDown = false;
    document.addEventListener("mousedown", (e) => {
        middleMouseDown = (e.button === 1);
    });
    document.addEventListener("mouseup", (e) => {
        middleMouseDown = false;
    })
    document.addEventListener("mousemove", (e) => {
        if (middleMouseDown) {
            view.xPanOffset += e.movementX;
            view.yPanOffset -= e.movementY;
        }
    });

    document.addEventListener("wheel", (e) => {
        const factor = Math.pow(0.999, e.deltaY);

        if (view.zoom <= 0.01 && factor < 1)
            return;

        // const biggerDim = Math.max(canvas.width, canvas.height);
        // const toPlotSpace = (x, y) => {
        //     return {
        //         x: (((x - view.xPanOffset) / canvas.width * 4 - 2) * biggerDim / canvas.height + view.xZoomOffset) / view.zoom,
        //         y: (((y - view.yPanOffset) / canvas.height * 4 - 2) * biggerDim / canvas.width + view.yZoomOffset) / view.zoom,
        //     }
        // }

        view.zoom *= factor;
    });



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