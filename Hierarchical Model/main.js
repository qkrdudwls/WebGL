"use strict";

let gl;

let modelViewMatrix, projectionMatrix;
let stack = [];

let uModelViewMatrix, uProjectionMatrix;
let root;

let program;
let sphereBuffer, lineBuffer;

function createNode(name, translation, render, sibling = null, child = null) {
    let node = {
        name: name,
        translation: translation,
        rotation: vec3(0.0, 0.0, 0.0),
        transform: mat4(),
        worldMatrix: mat4(),
        render: render,
        sibling: sibling,
        child: child
    }
    return node;
}

function buildTreeFromHierarchy(joints, hierarchy, render) {
    const nodes = {};

    for (let name in joints) {
        nodes[name] = createNode(name, vec3(0, 0, 0), render);
    }

    function setLocalTranslation(name, parentPos) {
        const globalPos = vec3(joints[name][0], joints[name][1], joints[name][2]);
        const localPos = subtract(globalPos, parentPos);

        nodes[name].translation = localPos;

        const children = hierarchy[name];
        if (children.length === 0) return;

        nodes[name].child = nodes[children[0]];
        for (let i = 0; i < children.length - 1; i++) {
            nodes[children[i]].sibling = nodes[children[i + 1]];
        }

        for (let child of children) {
            setLocalTranslation(child, globalPos);
        }
    }

    nodes["HIPS"].translation = vec3(joints["HIPS"][0], joints["HIPS"][1], joints["HIPS"][2]);
    setLocalTranslation("HIPS", vec3(0, 0, 0));

    return nodes["HIPS"];
}

function traverse(root) {
    if (root === null) return;

    stack.push({ node: root, parentMatrix: mat4(), parentNode: null });

    while (stack.length > 0) {
        const { node, parentMatrix, parentNode } = stack.pop();
        if (!node) continue;

        let t = translate(node.translation);
        let rx = rotate(node.rotation[0], vec3(1, 0, 0));
        let ry = rotate(node.rotation[1], vec3(0, 1, 0));
        let rz = rotate(node.rotation[2], vec3(0, 0, 1));
        node.transform = mult(t, mult(rz, mult(ry, rx)));
        node.worldMatrix = mult(parentMatrix, node.transform);

        node.render(node.worldMatrix);

        if (parentNode) {
            const from = mult(parentNode.worldMatrix, vec4(0, 0, 0, 1));
            const to = mult(node.worldMatrix, vec4(0, 0, 0, 1));
            renderBone(from, to, mat4());
        }

        if (node.child) {
            let child = node.child;
            while (child) {
                stack.push({ node:child, parentMatrix: node.worldMatrix, parentNode: node });
                child = child.sibling;
            }
        }

        if (node.sibling) {
            stack.push({ node: node.sibling, parentMatrix: parentMatrix });
        }
    }
}

function animateTree(node, time) {
    let angle = Math.sin(time * 0.002) * 30;

    if (node.name === "LEFT_ARM") node.rotation[2] = angle;
    if (node.name === "RIGHT_ARM") node.rotation[2] = -angle;

    if (node.child) animateTree(node.child, time);
    if (node.sibling) animateTree(node.sibling, time);
}

window.onload = function init() {
    const canvas = document.getElementById("glCanvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL is not available") };

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
    uProjectionMatrix = gl.getUniformLocation(program, "uProjectionMatrix");

    sphereBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([vec4(0, 0, 0, 1)]), gl.STATIC_DRAW);

    lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([vec4(), vec4()]), gl.DYNAMIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    root = buildTreeFromHierarchy(JOINTS, hierarchy, renderJoint);

    modelViewMatrix = lookAt(vec3(0.0, 0.3, 1.5), vec3(0.0, 0.1, 0.0), vec3(0.0, 1.0, 0.0));
    projectionMatrix = perspective(60, canvas.width / canvas.height, 0.1, 10.0);

    render();
}

function renderJoint(worldMatrix) {
    gl.useProgram(program);

    const mvMatrix = mult(modelViewMatrix, worldMatrix);
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
    const vPositionLoc = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionLoc);

    gl.drawArrays(gl.POINTS, 0, 1);
}

function renderBone(from, to, worldMatrix) {
    gl.useProgram(program);

    const mvMatrix = mult(modelViewMatrix, worldMatrix);
    gl.uniformMatrix4fv(uModelViewMatrix, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(uProjectionMatrix, false, flatten(projectionMatrix));

    const vertices = [from, to];

    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.drawArrays(gl.LINES, 0, 2);
}

function render(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    animateTree(root, time);

    traverse(root);

    requestAnimationFrame(render);
}