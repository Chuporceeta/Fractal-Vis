'use client'
import {useEffect, useRef} from "react";
import {fsSource, vsSource} from "@/shaders";

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    }
    return shader;
}

function draw(gl, programInfo, canvas, t, view, pixelToC) {
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

    gl.uniform1f(programInfo.uniformLocations.maxIter, 1000);
    gl.uniform1f(programInfo.uniformLocations.zoom, view.zoom);
    gl.uniform2f(programInfo.uniformLocations.panOffset, view.xPanOffset, view.yPanOffset);
    gl.uniform2f(programInfo.uniformLocations.zoomOffset, view.xZoomOffset, view.yZoomOffset);
    gl.uniform2f(programInfo.uniformLocations.dims, canvas.width, canvas.height);

    gl.uniform1i(programInfo.uniformLocations.pixelToC, pixelToC);

    const cx = 0.7885 * Math.cos(t), cy = 0.7885 * Math.sin(t);
    gl.uniform2f(programInfo.uniformLocations.c, cx, cy);
    const R = Math.ceil(0.5 + Math.sqrt(1 + 4*Math.sqrt(cx*cx + cy*cy))/2);
    gl.uniform1f( programInfo.uniformLocations.R, 2*R);



    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export const WebGLCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
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
                panOffset: gl.getUniformLocation(shaderProgram, "uPanOffset"),
                maxIter: gl.getUniformLocation(shaderProgram, "uMaxIter"),
                c: gl.getUniformLocation(shaderProgram, "uC"),
                R: gl.getUniformLocation(shaderProgram, "uR"),
                pixelToC: gl.getUniformLocation(shaderProgram, "uPixelToC"),
            }
        };

        let view = {
            zoom: 1.0,
            xPanOffset: 0,
            yPanOffset: 0,
            xZoomOffset: 0,
            yZoomOffset: 0,
        };

        document.addEventListener("mousemove", (e) => {
            if (e.buttons === 1) {
                view.xPanOffset += e.movementX;
                view.yPanOffset -= e.movementY;
            }
        });

        document.addEventListener("wheel", (e) => {
            const factor = Math.pow(0.999, e.deltaY);

            if (view.zoom <= 0.01 && factor < 1)
                return;

            const biggerDim = Math.max(canvas.width, canvas.height);

            const zoomPt = {
                x: ((e.clientX - view.xPanOffset) / canvas.width * 4 - 2) * biggerDim / canvas.height / view.zoom,
                y: ((canvas.height - e.clientY - view.yPanOffset) / canvas.height * 4 - 2) * biggerDim / canvas.width / view.zoom,
            }

            view.xZoomOffset += zoomPt.x * (1 - 1 / factor);
            view.yZoomOffset += zoomPt.y * (1 - 1 / factor);
            view.zoom *= factor;
        });

        let t = 0, paused = false;
        document.addEventListener("keydown", (e) => {
            if (e.key === " ")
                paused = !paused;
        });

        let then = 0;
        function render(now) {
            if (!paused)
                t += now - then;
            then = now;
            draw(gl, programInfo, canvas, t/4000, view, true);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render)

    }, []);
    return <canvas ref={canvasRef} />;
}