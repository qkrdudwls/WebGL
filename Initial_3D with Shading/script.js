"use strict";

let gl;
const depth = 0.1;
let theta = [0, 0, 0];
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = -1;

let vertices = [];
let pointsArraysY = [];
let pointsArraysJ = [];
let pointsArraysP = [];
let normalArraysY = [];
let normalArraysJ = [];
let normalArraysP = [];

let modelViewMatrix;
let modelViewMatrixLoc;
let projectionMatrix;
let projectionMatrixLoc;

let eye = vec3(0.0, 0.0, 1.5);
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

let dragging = false;
let lastX = 0;
let lastY = 0;
let azimuth = 0;
let elevation = 0;
let radius = 1.5;

let lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
let lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
let lightDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
let lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

let materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
let materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
let materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
let materialShininess = 100.0;

let backgroundColor = false;

const toRadians = deg => deg * Math.PI / 180;

let cameras = {
    front: vec3(0.0, 0.0, 1.5),
    side: vec3(1.5, 0.0, 0.0),
    top: vec3(0.0, 1.5, 0.0)
}

let vPosition;
let vNormal;
let vBufferY, vBufferJ, vBufferP;
let vNormalY, vNormalJ, vNormalP;

let program;

window.onload = function init()
{
    let canvas = document.getElementById( "glCanvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    gl.enable( gl.DEPTH_TEST );
    if ( !gl ) { alert( "WebGL is not available" ); }

    vertices = [
        // Y
        vec4(-0.5, 0.0, 0.0, 1.0),
        vec4(-0.6, 0.2, 0.0, 1.0),
        vec4(-0.5, 0.2, 0.0, 1.0),
        vec4(-0.4, 0.0, 0.0, 1.0),
        vec4(-0.5, 0.0, -0.1, 1.0),
        vec4(-0.6, 0.2, -0.1, 1.0),
        vec4(-0.5, 0.2, -0.1, 1.0),
        vec4(-0.4, 0.0, -0.1, 1.0),

        vec4(-0.5, 0.0, 0.0, 1.0),
        vec4(-0.4, 0.2, 0.0, 1.0),
        vec4(-0.3, 0.2, 0.0, 1.0),
        vec4(-0.4, 0.0, 0.0, 1.0),
        vec4(-0.5, 0.0, -0.1, 1.0),
        vec4(-0.4, 0.2, -0.1, 1.0),
        vec4(-0.3, 0.2, -0.1, 1.0),
        vec4(-0.4, 0.0, -0.1, 1.0),

        vec4(-0.5, -0.2, 0.0, 1.0),
        vec4(-0.5, 0.0, 0.0, 1.0),
        vec4(-0.4, 0.0, 0.0, 1.0),
        vec4(-0.4, -0.2, 0.0, 1.0),
        vec4(-0.5, -0.2, -0.1, 1.0),
        vec4(-0.5, 0.0, -0.1, 1.0),
        vec4(-0.4, 0.0, -0.1, 1.0),
        vec4(-0.4, -0.2, -0.1, 1.0),

        // J
        vec4(-0.2, 0.1, 0.0, 1.0),
        vec4(-0.2, 0.2, 0.0, 1.0),
        vec4(0.1, 0.2, 0.0, 1.0),
        vec4(0.1, 0.1, 0.0, 1.0),
        vec4(-0.2, 0.1, -0.1, 1.0),
        vec4(-0.2, 0.2, -0.1, 1.0),
        vec4(0.1, 0.2, -0.1, 1.0),
        vec4(0.1, 0.1, -0.1, 1.0),

        vec4(0.0, -0.2, 0.0, 1.0),
        vec4(0.0, 0.1, 0.0, 1.0),
        vec4(0.1, 0.1, 0.0, 1.0),
        vec4(0.1, -0.1, 0.0, 1.0),
        vec4(0.0, -0.2, -0.1, 1.0),
        vec4(0.0, 0.1, -0.1, 1.0),
        vec4(0.1, 0.1, -0.1, 1.0),
        vec4(0.1, -0.1, -0.1, 1.0),

        vec4(-0.1, -0.2, 0.0, 1.0),
        vec4(-0.1, -0.1, 0.0, 1.0),
        vec4(0.0, -0.1, 0.0, 1.0),
        vec4(0.0, -0.2, 0.0, 1.0),
        vec4(-0.1, -0.2, -0.1, 1.0),
        vec4(-0.1, -0.1, -0.1, 1.0),
        vec4(0.0, -0.1, -0.1, 1.0),
        vec4(0.0, -0.2, -0.1, 1.0),

        vec4(-0.2, -0.1, 0.0, 1.0),
        vec4(-0.2, 0.0, 0.0, 1.0),
        vec4(-0.1, -0.1, 0.0, 1.0),
        vec4(-0.1, -0.2, 0.0, 1.0),
        vec4(-0.2, -0.1, -0.1, 1.0),
        vec4(-0.2, 0.0, -0.1, 1.0),
        vec4(-0.1, -0.1, -0.1, 1.0),
        vec4(-0.1, -0.2, -0.1, 1.0),

        // P
        vec4(0.2, 0.1, 0.0, 1.0),
        vec4(0.2, 0.2, 0.0, 1.0),
        vec4(0.4, 0.2, 0.0, 1.0),
        vec4(0.5, 0.1, 0.0, 1.0),
        vec4(0.2, 0.1, -0.1, 1.0),
        vec4(0.2, 0.2, -0.1, 1.0),
        vec4(0.4, 0.2, -0.1, 1.0),
        vec4(0.5, 0.1, -0.1, 1.0),

        vec4(0.2, 0.0, 0.0, 1.0),
        vec4(0.2, 0.1, 0.0, 1.0),
        vec4(0.3, 0.1, 0.0, 1.0),
        vec4(0.3, 0.0, 0.0, 1.0),
        vec4(0.2, 0.0, -0.1, 1.0),
        vec4(0.2, 0.1, -0.1, 1.0),
        vec4(0.3, 0.1, -0.1, 1.0),
        vec4(0.3, 0.0, -0.1, 1.0),

        vec4(0.4, 0.0, 0.0, 1.0),
        vec4(0.4, 0.1, 0.0, 1.0),
        vec4(0.5, 0.1, 0.0, 1.0),
        vec4(0.5, 0.0, 0.0, 1.0),
        vec4(0.4, 0.0, -0.1, 1.0),
        vec4(0.4, 0.1, -0.1, 1.0),
        vec4(0.5, 0.1, -0.1, 1.0),
        vec4(0.5, 0.0, -0.1, 1.0),

        vec4(0.2, -0.1, 0.0, 1.0),
        vec4(0.2, 0.0, 0.0, 1.0),
        vec4(0.5, 0.0, 0.0, 1.0),
        vec4(0.4, -0.1, 0.0, 1.0),
        vec4(0.2, -0.1, -0.1, 1.0),
        vec4(0.2, 0.0, -0.1, 1.0),
        vec4(0.5, 0.0, -0.1, 1.0),
        vec4(0.4, -0.1, -0.1, 1.0),

        vec4(0.2, -0.2, 0.0, 1.0),
        vec4(0.2, -0.1, 0.0, 1.0),
        vec4(0.3, -0.1, 0.0, 1.0),
        vec4(0.3, -0.2, 0.0, 1.0),
        vec4(0.2, -0.2, -0.1, 1.0),
        vec4(0.2, -0.1, -0.1, 1.0),
        vec4(0.3, -0.1, -0.1, 1.0),
        vec4(0.3, -0.2, -0.1, 1.0)
    ];

    colorInitial();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");

    vBufferY = gl.createBuffer();
    vBufferJ = gl.createBuffer();
    vBufferP = gl.createBuffer();
    vNormalY = gl.createBuffer();
    vNormalJ = gl.createBuffer();
    vNormalP = gl.createBuffer();

    setupBuffers();

    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vNormal);

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(60, canvas.width / canvas.height, 0.1, 20.0);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    let ambientProduct = mult(lightAmbient, materialAmbient);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess); 

    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));

    document.getElementById( "Background" ).onclick = function () {
        backgroundColor = !backgroundColor;
        if (backgroundColor) {
            document.getElementById( "Background" ).value = "White"; 
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
        } else {
            document.getElementById( "Background" ).value = "Black";
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }
    }

    initOrbitControl(canvas);

    render();
};

function setupBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferY);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArraysY), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalY);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalArraysY), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferJ);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArraysJ), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalJ);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalArraysJ), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferP);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArraysP), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalP);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalArraysP), gl.STATIC_DRAW);
}

function colorInitial() {
    for (let i = 0; i < 24; i += 8) {
        quad(i + 1, i, i + 3, i + 2, 'Y');
        quad(i + 2, i + 3, i + 7, i + 6, 'Y');
        quad(i + 3, i, i + 4, i + 7, 'Y');
        quad(i + 6, i + 5, i + 1, i + 2, 'Y');
        quad(i + 4, i + 5, i + 6, i + 7, 'Y');
        quad(i + 5, i + 4, i, i + 1, 'Y');
    }

    for (let i = 24; i < 56; i += 8) {
        quad(i + 1, i, i + 3, i + 2, 'J');
        quad(i + 2, i + 3, i + 7, i + 6, 'J');
        quad(i + 3, i, i + 4, i + 7, 'J');
        quad(i + 6, i + 5, i + 1, i + 2, 'J');
        quad(i + 4, i + 5, i + 6, i + 7, 'J');
        quad(i + 5, i + 4, i, i + 1, 'J');
    }

    for (let i = 56; i < 96; i += 8) {
        quad(i + 1, i, i + 3, i + 2, 'P');
        quad(i + 2, i + 3, i + 7, i + 6, 'P');
        quad(i + 3, i, i + 4, i + 7, 'P');
        quad(i + 6, i + 5, i + 1, i + 2, 'P');
        quad(i + 4, i + 5, i + 6, i + 7, 'P');
        quad(i + 5, i + 4, i, i + 1, 'P');
    }
}

function quad(a, b, c, d, letter) {
    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);
    normal = vec3(normal);

    let pointsArray;
    let normalArray;

    if (letter === 'Y') {
        pointsArray = pointsArraysY;
        normalArray = normalArraysY;
    } else if (letter === 'J') {
        pointsArray = pointsArraysJ;
        normalArray = normalArraysJ;
    } else {
        pointsArray = pointsArraysP;
        normalArray = normalArraysP;
    }

    pointsArray.push(vertices[a]);
    normalArray.push(normal);
    pointsArray.push(vertices[b]);
    normalArray.push(normal);
    pointsArray.push(vertices[c]);
    normalArray.push(normal);
    
    pointsArray.push(vertices[a]);
    normalArray.push(normal);
    pointsArray.push(vertices[c]);
    normalArray.push(normal);
    pointsArray.push(vertices[d]);
    normalArray.push(normal);
}

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

function setCameraView(view) {
    let targetEye, targetUp;
    
    switch (view) {
        case 'front':
            targetEye = vec3(0.0, 0.0, radius);
            targetUp = vec3(0.0, 1.0, 0.0);
            break;
        case 'leftside':
            targetEye = vec3(-radius, 0.0, 0.0);
            targetUp = vec3(0.0, 1.0, 0.0);
            break;
        case 'rightside':
            targetEye = vec3(radius, 0.0, 0.0);
            targetUp = vec3(0.0, 1.0, 0.0);
            break;
        case 'top':
            targetEye = vec3(0.0, radius, 0.0);
            targetUp = vec3(0.0, 0.0, -1.0);
            break;
        case 'back':
            targetEye = vec3(0.0, 0.0, -radius);
            targetUp = vec3(0.0, 1.0, 0.0);
            break;
    }

    animateCamera(targetEye, targetUp);

    document.getElementById("FrontButton").style.backgroundColor = "";
    document.getElementById("LeftSideButton").style.backgroundColor = "";
    document.getElementById("RightSideButton").style.backgroundColor = "";
    document.getElementById("TopButton").style.backgroundColor = "";
    document.getElementById("BackButton").style.backgroundColor = "";

    document.getElementById(view + "Button").style.backgroundColor = "#4CAF50";
}

function updateCamera() {
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function setLight(light) {
    document.getElementById( "PointLight" ).style.backgroundColor = "";
    document.getElementById( "DirectionalLight" ).style.backgroundColor = "";

    if (light === 'point') {
        lightPosition = vec4(1.0, 1.0, 1.0, 1.0);
        document.getElementById( "PointLight" ).style.backgroundColor = "#4CAF50";
    } else if (light === 'directional') {
        lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
        document.getElementById( "DirectionalLight" ).style.backgroundColor = "#4CAF50";
    }
    
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
}

document.addEventListener("keydown", function (e) {
    const step = 0.1;

    switch (e.key) {
        case "w": 
            lightPosition[1] += step; 
            break;
        case "s": 
            lightPosition[1] -= step; 
            break;
        case "a": 
            lightPosition[0] -= step; 
            break;
        case "d": 
            lightPosition[0] += step; 
            break;
        case "q": 
            lightPosition[2] -= step; 
            break;
        case "e": 
            lightPosition[2] += step; 
            break;
    }

    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
});

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

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferY);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalY);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArraysY.length);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferJ);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalJ);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArraysJ.length);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferP);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vNormalP);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArraysP.length);

    requestAnimationFrame(render);
}

window.setCameraView = setCameraView;
