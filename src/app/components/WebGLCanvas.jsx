'use client'
import {useEffect, useRef} from "react";
import {fsSource, vsSource} from "@/shaders";

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function draw(gl, programInfo, canvas, view, settings) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
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
    gl.uniform2f(programInfo.uniformLocations.panOffset, view.xPanOffset, view.yPanOffset);
    gl.uniform2f(programInfo.uniformLocations.zoomOffset, view.xZoomOffset, view.yZoomOffset);
    gl.uniform2f(programInfo.uniformLocations.dims, canvas.width, canvas.height);

    gl.uniform1f(programInfo.uniformLocations.maxIter, settings.maxIter);
    gl.uniform2f(programInfo.uniformLocations.flip, settings.xFlip, settings.yFlip);
    gl.uniform1i(programInfo.uniformLocations.pixelToC, settings.pixelToC);

    const cx = 0.7885 * Math.cos(settings.t), cy = 0.7885 * Math.sin(settings.t);
    gl.uniform2f(programInfo.uniformLocations.c, cx, cy);
    gl.uniform1f(programInfo.uniformLocations.R, settings.rad);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export const WebGLCanvas = ({
    initialState = {
        preview: false,
        view: {
            zoom: 1.0,
            xPanOffset: 0,
            yPanOffset: 0,
            xZoomOffset: 0,
            yZoomOffset: 0,
        },
    },
    stateRef,
    updateState,
}) => {
    const canvasRef = useRef(null);
    const programInfoRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl");

        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource(stateRef.current.iterFunc));
        if (fragmentShader === null)
            return;

        gl.deleteProgram(programInfoRef.current?.program);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        programInfoRef.current = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            },
            uniformLocations: {
                dims: gl.getUniformLocation(shaderProgram, "uDims"),
                zoom: gl.getUniformLocation(shaderProgram, "uZoom"),
                zoomOffset: gl.getUniformLocation(shaderProgram, "uZoomOffset"),
                panOffset: gl.getUniformLocation(shaderProgram, "uPanOffset"),
                flip: gl.getUniformLocation(shaderProgram, "uFlip"),
                maxIter: gl.getUniformLocation(shaderProgram, "uMaxIter"),
                c: gl.getUniformLocation(shaderProgram, "uC"),
                R: gl.getUniformLocation(shaderProgram, "uR"),
                pixelToC: gl.getUniformLocation(shaderProgram, "uPixelToC"),
            }
        };
    }, [stateRef.current.iterFunc]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl");

        let view = initialState.view;
        canvas.addEventListener("mousemove", (e) => {
            if (e.buttons === 1) {
                view.xPanOffset += e.movementX;
                view.yPanOffset -= e.movementY;
            }
        });

        canvas.addEventListener("wheel", (e) => {
            const factor = Math.pow(0.999, e.deltaY);

            if (view.zoom <= 0.01 && factor < 1)
                return;

            const biggerDim = Math.max(canvas.width, canvas.height);

            const zoomPt = {
                x: ((e.offsetX - view.xPanOffset) / canvas.width * 4 - 2) * biggerDim / canvas.height / view.zoom,
                y: ((canvas.height - e.offsetY - view.yPanOffset) / canvas.height * 4 - 2) * biggerDim / canvas.width / view.zoom,
            }

            view.xZoomOffset += zoomPt.x * (1 - 1 / factor);
            view.yZoomOffset += zoomPt.y * (1 - 1 / factor);
            view.zoom *= factor;
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                updateState("paused", !stateRef.current.paused);
            }
        });

        let then = 0;
        function render(now) {
            const state = stateRef.current;
            if (!state.paused)
                updateState("t", (state.t + (now - then) / 100 * state.animSpeed) % state.tLoop);
            then = now;

            draw(gl, programInfoRef.current, canvas, view, state);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }, []);

    return <canvas ref={canvasRef} />;
}