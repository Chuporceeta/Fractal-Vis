function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
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

    const vertexPosLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition");

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0]),
        gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(vertexPosLoc, 2, gl.FLOAT, false, 0, 0
    )
    gl.enableVertexAttribArray(vertexPosLoc);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
main();