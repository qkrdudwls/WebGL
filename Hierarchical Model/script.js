"use strict";

let gl;
let bvhParser = null;
let modelViewMatrix, projectionMatrix;
let modelViewMatrixLoc, projectionMatrixLoc;

let eye = vec3(0.0, 0.0, 1.5);
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

let dragging = false;
let lastX = 0;
let lastY = 0;
let azimuth = 0;
let elevation = 0;
let radius = 1.5;

let indexCount = 0;

const toRadians = deg => deg * Math.PI / 180;

let cameras = {
    front: vec3(0.0, 0.0, 1.5),
    side: vec3(1.5, 0.0, 0.0),
    top: vec3(0.0, 1.5, 0.0)
}

function createCubeVertices(x, y, z, width, height, depth) {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;
    return [
        vec4(x - w, y - h, z + d, 1.0), 
        vec4(x + w, y - h, z + d, 1.0), 
        vec4(x + w, y + h, z + d, 1.0), 
        vec4(x - w, y + h, z + d, 1.0), 
        vec4(x - w, y - h, z - d, 1.0), 
        vec4(x + w, y - h, z - d, 1.0), 
        vec4(x + w, y + h, z - d, 1.0), 
        vec4(x - w, y + h, z - d, 1.0) 
    ];
}

function getCubeIndices(offset = 0) {
    const base = [
        0,1,2, 0,2,3, 
        4,5,6, 4,6,7,  
        0,4,7, 0,7,3,  
        1,5,6, 1,6,2,  
        3,2,6, 3,6,7,  
        0,1,5, 0,5,4   
    ];
    return base.map(i => i + offset);
}

const bones = {
    head: { 
        vertices: createCubeVertices(0.0, 0.65, 0.0, 0.2, 0.2, 0.2) 
    },
    neck: { 
        vertices: createCubeVertices(0.0, 0.525, 0.0, 0.05, 0.05, 0.05) 
    },
    spine1: { 
        vertices: createCubeVertices(0.0, 0.45, 0.0, 0.1, 0.1, 0.1) 
    },
    spine: { 
        vertices: createCubeVertices(0.0, 0.3, 0.0, 0.1, 0.2, 0.1) 
    },
    spine2: { 
        vertices: createCubeVertices(0.0, 0.1, 0.0, 0.1, 0.2, 0.1) 
    },
    hips: { 
        vertices: createCubeVertices(0.0, -0.05, 0.0, 0.1, 0.1, 0.1) 
    },
    leftShoulder: { 
        vertices: createCubeVertices(-0.175, 0.45, 0.0, 0.35, 0.1, 0.1) 
    },
    rightShoulder: { 
        vertices: createCubeVertices(0.175, 0.45, 0.0, 0.35, 0.1, 0.1) 
    },
    leftArm: { 
        vertices: createCubeVertices(-0.3, 0.35, 0.0, 0.1, 0.3, 0.1) 
    },
    leftForeArm: { 
        vertices: createCubeVertices(-0.3, 0.05, 0.0, 0.1, 0.3, 0.1) 
    },
    leftHand: { 
        vertices: createCubeVertices(-0.3, -0.15, 0.0, 0.1, 0.1, 0.1) 
    },
    rightArm: { 
        vertices: createCubeVertices(0.3, 0.35, 0.0, 0.1, 0.3, 0.1) 
    },
    rightForeArm: { 
        vertices: createCubeVertices(0.3, 0.05, 0.0, 0.1, 0.3, 0.1) 
    },
    rightHand: { 
        vertices: createCubeVertices(0.3, -0.15, 0.0, 0.1, 0.1, 0.1) 
    },
    leftUpLeg: { 
        vertices: createCubeVertices(-0.1, -0.2, 0.0, 0.1, 0.4, 0.1) 
    },
    leftLeg: { 
        vertices: createCubeVertices(-0.1, -0.55, 0.0, 0.1, 0.3, 0.1) 
    },
    leftFoot: { 
        vertices: createCubeVertices(-0.1, -0.75, 0.0, 0.1, 0.1, 0.1) 
    },
    rightUpLeg: { 
        vertices: createCubeVertices(0.1, -0.2, 0.0, 0.1, 0.4, 0.1) 
    },
    rightLeg: { 
        vertices: createCubeVertices(0.1, -0.55, 0.0, 0.1, 0.3, 0.1) 
    },
    rightFoot: { 
        vertices: createCubeVertices(0.1, -0.75, 0.0, 0.1, 0.1, 0.1) 
    }
};

function animateCamera(targetEye, targetUp, duration = 1000) {
    const startEye = vec3(eye[0], eye[1], eye[2]);
    const startUp = vec3(up[0], up[1], up[2]);
    const startTime = Date.now();

    function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        eye = vec3(
            startEye[0] + (targetEye[0] - startEye[0]) * easeProgress,
            startEye[1] + (targetEye[1] - startEye[1]) * easeProgress,
            startEye[2] + (targetEye[2] - startEye[2]) * easeProgress
        );
        
        up = normalize(vec3(
            startUp[0] + (targetUp[0] - startUp[0]) * easeProgress,
            startUp[1] + (targetUp[1] - startUp[1]) * easeProgress,
            startUp[2] + (targetUp[2] - startUp[2]) * easeProgress
        ));

        updateCamera();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function updateCamera() {
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function initOrbitControl(canvas) {
    let rotationMatrix = mat4();
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseDown = false;

    canvas.addEventListener("mousedown", function(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    });

    canvas.addEventListener("mouseup", function() {
        mouseDown = false;
    });

    canvas.addEventListener("mousemove", function(event) {
        if (!mouseDown) {
            return;
        }

        let newX = event.clientX;
        let newY = event.clientY;

        let deltaX = newX - lastMouseX;
        let deltaY = newY - lastMouseY;

        let rotation = mat4();
        rotation = mult(rotation, rotate(deltaY / 5, vec3(1, 0, 0)));
        rotation = mult(rotation, rotate(deltaX / 5, vec3(0, 1, 0)));

        rotationMatrix = mult(rotation, rotationMatrix);
        
        let rotatedEye = mult(rotationMatrix, vec4(0, 0, radius, 1));
        eye = vec3(rotatedEye[0], rotatedEye[1], rotatedEye[2]);
        
        let rotatedUp = mult(rotationMatrix, vec4(0, 1, 0, 0));
        up = normalize(vec3(rotatedUp[0], rotatedUp[1], rotatedUp[2]));

        updateCamera();

        lastMouseX = newX;
        lastMouseY = newY;
    });

    canvas.addEventListener("wheel", function(event) {
        event.preventDefault();
     
        let zoomSensitivity = 0.001;
        radius = Math.max(1.0, Math.min(5.0, radius + event.deltaY * zoomSensitivity));
        
        let direction = normalize(subtract(eye, at));
        eye = add(at, scale(radius, direction));
        
        updateCamera();
    });
}

function updateEyePosition() {
    const radAz = toRadians(azimuth);
    const radEl = toRadians(elevation);

    eye[0] = radius * Math.cos(radEl) * Math.sin(radAz);
    eye[1] = radius * Math.sin(radEl);
    eye[2] = radius * Math.cos(radEl) * Math.cos(radAz);

    updateCamera();
}

window.onload = function init() {
    loadBVHFile("Idle.bvh");
    const canvas = document.getElementById("glCanvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL not available"); return; }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    let allVertices = [];
    let allIndices = [];
    let vOffset = 0, iOffset = 0;
    const bonesOrder = [];

    for (const name in bones) {
        const verts = bones[name].vertices;
        const inds = getCubeIndices(vOffset);

        bonesOrder.push({ indexStart: iOffset, indexCount: inds.length });

        allVertices.push(...verts);
        allIndices.push(...inds);
        vOffset += verts.length;
        iOffset += inds.length;
    }
    window.bonesOrder = bonesOrder;
    indexCount = allIndices.length;

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(allVertices), gl.STATIC_DRAW);
    const vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPos);

    const iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(allIndices), gl.STATIC_DRAW);

    modelViewMatrixLoc  = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(70.0, canvas.width / canvas.height, 0.1, 10.0);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    initOrbitControl(canvas);

    render();
};

let bvhToJsBoneMap = {
    "mixamorig:Hips": "hips",
    "mixamorig:Spine": "spine2",
    "mixamorig:Spine1": "spine1",
    "mixamorig:Spine2": "spine",
    "mixamorig:Neck": "neck",
    "mixamorig:Head": "head",
    "mixamorig:RightShoulder": "rightShoulder",
    "mixamorig:RightArm": "rightArm",
    "mixamorig:RightForeArm": "rightForeArm",
    "mixamorig:RightHand": "rightHand",
    "mixamorig:LeftShoulder": "leftShoulder",
    "mixamorig:LeftArm": "leftArm",
    "mixamorig:LeftForeArm": "leftForeArm",
    "mixamorig:LeftHand": "leftHand",
    "mixamorig:RightUpLeg": "rightUpLeg",
    "mixamorig:RightLeg": "rightLeg",
    "mixamorig:RightFoot": "rightFoot",
    "mixamorig:LeftUpLeg": "leftUpLeg",
    "mixamorig:LeftLeg": "leftLeg",
    "mixamorig:LeftFoot": "leftFoot"
};

function applyBVHAnimation(frameIndex) {
    for (const [bvhName, jsName] of Object.entries(bvhToJsBoneMap)) {
        const pose = bvhParser.getJointPose(frameIndex, bvhName);
        if (!pose || !bones[jsName]) continue;

        const rx = toRadians(pose.Xrotation || 0);
        const ry = toRadians(pose.Yrotation || 0);
        const rz = toRadians(pose.Zrotation || 0);

        const rotationMatrix =
            mult(rotateZ(rz),
            mult(rotateY(ry),
                 rotateX(rx)));

        bones[jsName].transformedVertices = bones[jsName].vertices.map(v => mult(rotationMatrix, v));
    }
}

function render(frameIndex = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    if (bvhParser) {
        applyBVHAnimation(frameIndex % bvhParser.frames.length);
    }

    for (const bone of window.bonesOrder) {
        const offset = bone.indexStart * Uint16Array.BYTES_PER_ELEMENT;
        gl.drawElements(gl.TRIANGLES, bone.indexCount, gl.UNSIGNED_SHORT, offset);
    }

    requestAnimationFrame(() => render(frameIndex + 1));
}

function loadBVHFile(url) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            bvhParser = new BVHParser(text);
        });
}

window.setCameraView = setCameraView;
