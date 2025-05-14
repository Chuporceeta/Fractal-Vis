function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function draw(gl, programInfo, canvas, t) {
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

    gl.uniform2f(programInfo.uniformLocations.dims, canvas.width, canvas.height);

    const cx = 0.7885 * Math.cos(t),
          cy = 0.7885 * Math.sin(t);
    gl.uniform2f(programInfo.uniformLocations.c, cx, cy);
    const R = Math.ceil(0.5 + Math.sqrt(1 + 4*Math.sqrt(cx*cx + cy*cy))/2);
    gl.uniform1f( programInfo.uniformLocations.R, R);


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
            c: gl.getUniformLocation(shaderProgram, "c"),
            R: gl.getUniformLocation(shaderProgram, "R"),
        }
    }

    function render(now) {
        draw(gl, programInfo, canvas, now/4000);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render)

}
main();