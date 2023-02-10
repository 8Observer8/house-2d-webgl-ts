import { mat4, vec3 } from "gl-matrix";
import { gl, initWebGLContext } from "./webgl-context.js";
import createProgram from "./shader-program.js";
import Renderable from "./renderable.js";

let uMvpMatrixLocation, uColorLocation;

const modelMatrix = mat4.create();
const mvpMatrix = mat4.create();

const projMatrix = mat4.create();
mat4.ortho(projMatrix, 0, 200, 200, 0, 1, -1);

const viewMatrix = mat4.create();
mat4.lookAt(viewMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0]);

const projViewMatrix = mat4.create();
mat4.mul(projViewMatrix, projMatrix, viewMatrix);

const housePosXElem = document.getElementById("housePosX") as HTMLInputElement;
const housePosYElem = document.getElementById("housePosY") as HTMLInputElement;

let housePosX = parseInt(housePosXElem.value);
let housePosY = parseInt(housePosYElem.value);

const houseBody = new Renderable(0, 0, 100, 100, vec3.fromValues(0, 0.7, 0), 0, 4);
const roof = new Renderable(-10, 0, 50, 50, vec3.fromValues(0.35, 0.25, 0.2), 4, 4);
const houseWindow = new Renderable(20, 20, 30, 50, vec3.fromValues(0, 0, 0), 0, 4);
const windowLine0 = new Renderable(20, 38, 30, 4, vec3.fromValues(1, 1, 1), 0, 4);
const windowLine1 = new Renderable(33, 40, 4, 30, vec3.fromValues(1, 1, 1), 0, 4);
console.log("hello");
const objects = [];
objects.push(houseBody);
objects.push(roof);
objects.push(houseWindow);
objects.push(windowLine0);
objects.push(windowLine1);

const applyButton = document.getElementById("applyButton");

applyButton.onclick = () => {
    housePosX = parseInt(housePosXElem.value);
    housePosY = parseInt(housePosYElem.value);
    draw();
};

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    objects.forEach(obj => {
        mat4.fromTranslation(modelMatrix, [housePosX + obj.x,
            housePosY + obj.y, 0]);
        mat4.rotateZ(modelMatrix, modelMatrix, obj.angle * Math.PI / 180);
        mat4.scale(modelMatrix, modelMatrix, [obj.w, obj.h, 1]);
        mat4.mul(mvpMatrix, projViewMatrix, modelMatrix);
        gl.uniformMatrix4fv(uMvpMatrixLocation, false, mvpMatrix);
        gl.uniform3fv(uColorLocation, obj.color);
        gl.drawArrays(gl.TRIANGLE_STRIP, obj.startIndex, obj.amountOfVertices);
    });
}

async function init() {
    if (!initWebGLContext("renderCanvas")) return;

    gl.clearColor(0.77, 0.93, 0.95, 1);

    const program = await createProgram("assets/shaders/",
        "default.vert", "default.frag");

    const vertPositions = [
        0, 0, // Quad
        1, 0,
        0, 1,
        1, 1,
        0, 0, // Triangle
        1.2, -1,
        2.4, 0
    ];
    const vertPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPositions),
        gl.STATIC_DRAW);

    const aPositionLocation = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositionLocation);

    uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
    uColorLocation = gl.getUniformLocation(program, "uColor");

    draw();
}

init();
