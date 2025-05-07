"use strict";

let gl;
const depth = 0.1;
let theta = [0, 0, 0];
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = -1;

let vertices = [];
let pointsArrays = [];
let normalArrays = [];

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

const toRadians = deg => deg * Math.PI / 180;

let cameras = {
    front: vec3(0.0, 0.0, 1.5),
    side: vec3(1.5, 0.0, 0.0),
    top: vec3(0.0, 1.5, 0.0)
}

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
        vec4(0.5, 0.2, 0.0, 1.0),
        vec4(0.2, 0.1, -0.1, 1.0),
        vec4(0.2, 0.2, -0.1, 1.0),
        vec4(0.4, 0.2, -0.1, 1.0),
        vec4(0.5, 0.2, -0.1, 1.0),

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
    gl.clearColor( 1., 1., 1.0, 1.0 );

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 10.0);

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

    let nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalArrays), gl.STATIC_DRAW );

    let vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArrays), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    let vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    canvas.addEventListener("mousedown", function(e) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    canvas.addEventListener("mouseup", function() {
        dragging = false;
    })

    canvas.addEventListener("mousemove", function(e) {
        if (dragging) {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;

            azimuth += dx * 0.5;
            elevation += dy * 0.5;

            elevation = Math.max(-89, Math.min(89, elevation));

            updateEyePosition();
            lastX = e.clientX;
            lastY = e.clientY;
        }
    })

    render();
};

function quad(a, b, c, d) {
    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[b]);
    let normal = cross(t1, t2);
    normal = vec3(normal);

    pointsArrays.push(vertices[a]);
    normalArrays.push(normal);
    pointsArrays.push(vertices[b]);
    normalArrays.push(normal);
    pointsArrays.push(vertices[c]);
    normalArrays.push(normal);
    
    pointsArrays.push(vertices[a]);
    normalArrays.push(normal);
    pointsArrays.push(vertices[c]);
    normalArrays.push(normal);
    pointsArrays.push(vertices[d]);
    normalArrays.push(normal);
}

function colorInitial() {
    for ( let i = 0; i < vertices.length; i += 8 ){
        quad( i + 1, i, i + 3, i + 2 );
        quad( i + 2, i + 3, i + 7, i + 6);
        quad( i + 3, i , i + 4, i + 7 );
        quad( i + 6, i + 5, i + 1, i + 2 );
        quad( i + 4, i + 5, i + 6, i + 7 );
        quad( i + 5, i + 4, i, i + 1 );    
    }
}

function setCameraView (view) {
    if (cameras[view]) {
        eye =  cameras[view];
        if (view === 'top') {
            up = vec3(0.0, 0.0, -1.0);
        } else {
            up = vec3(0.0, 1.0, 0.0);
        }
    }
}

function updateCamera() {
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
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
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.enable( gl.DEPTH_TEST );

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, pointsArrays.length);

    requestAnimationFrame(render); 
}

window.setCameraView = setCameraView;