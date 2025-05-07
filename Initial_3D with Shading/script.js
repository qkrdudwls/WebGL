"use strict";

let gl;
const depth = 0.1;
let theta = [0, 0, 0];
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = -1;

let vertices = [];
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

const toRadians = deg => deg * Math.PI / 100;

let cameras = {
    front: vec3(0.0, 0.0, 1.5),
    side: vec3(1.5, 0.0, 0.0),
    top: vec3(0.0, 1.5, 0.0)
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
    eye[2] = radius * Math.cos(radEl) * Math.sin(radAz);
}

function computeNormals(vertices) {
    let normals = [];

    let drawCommands = [
        [0, 3], [1, 3], [2, 3], [3, 3], [6, 3], [7, 3], [10, 3], [11, 3],
        [13, 3], [14, 3], [16, 3], [17, 3], [18, 3], [19, 3], [22, 3], [23, 3],
        [26, 3], [27, 3], [28, 3], [29, 3], [30, 3], [31, 3], [33, 3], [34, 3],
        [37, 3], [38, 3], [39, 3], [40, 3], [43, 3], [44, 3], [47, 3], [48, 3],
        [50, 3], [51, 3], [53, 3], [54, 3], [55, 3], [56, 3], [59, 3], [60, 3],
        [63, 3], [64, 3], [65, 3], [66, 3], [67, 3], [68, 3], [70, 3], [71, 3]
    ];

    for (let [start, count] of drawCommands) {
        for (let i = start; i < start + count; i += 3) {
            let a = vertices[i];
            let b = vertices[i + 1];
            let c = vertices[i + 2];

            let t1 = subtract(b, a);
            let t2 = subtract(c, a);
            let normal = normalize(cross(t1, t2));

            normals[i] = normal;
            normals[i + 1] = normal;
            normals[i + 2] = normal;
        }
    }

    for (let i = 74; i < vertices.length; i += 3) {
        let a = vertices[i];
        let b = vertices[i + 1];
        let c = vertices[i + 2];

        let t1 = subtract(b, a);
        let t2 = subtract(c, a);
        let normal = normalize(cross(t1, t2));

        normals[i] = normal;
        normals[i + 1] = normal;
        normals[i + 2] = normal;
    }

    return normals;
}

window.onload = function init()
{
    let canvas = document.getElementById( "glCanvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL is not available" ); }

    var frontVertices = [
        // Y
        vec3(-0.6, 0.2, 0.0),
        vec3(-0.5, 0.2, 0.0),
        vec3(-0.5, 0.0, 0.0),
        vec3(-0.4, 0.0, 0.0),
        vec3(-0.4, 0.2, 0.0),
        vec3(-0.3, 0.2, 0.0),
        vec3(-0.5, 0.0, 0.0),
        vec3(-0.4, 0.0, 0.0),
        vec3(-0.5, -0.2, 0.0),
        vec3(-0.4, -0.2, 0.0),

        // J
        vec3(-0.2, 0.2, 0.0),
        vec3(-0.2, 0.1, 0.0),
        vec3(0.1, 0.2, 0.0),
        vec3(0.1, 0.1, 0.0),
        vec3(0.0, 0.1, 0.0),
        vec3(0.1, -0.1, 0.0),
        vec3(0.0, -0.2, 0.0),
        vec3(0.0, -0.1, 0.0),
        vec3(-0.1, -0.2, 0.0),
        vec3(-0.1, -0.1, 0.0),
        vec3(-0.2, -0.1, 0.0),
        vec3(-0.2, 0.0, 0.0),

        // P
        vec3(0.2, 0.2, 0.0),
        vec3(0.2, -0.2, 0.0),
        vec3(0.3, 0.2, 0.0),
        vec3(0.3, -0.2, 0.0),
        vec3(0.3, -0.1, 0.0),
        vec3(0.3, 0.0, 0.0),
        vec3(0.4, -0.1, 0.0),
        vec3(0.4, 0.0, 0.0),
        vec3(0.5, 0.0, 0.0),
        vec3(0.4, 0.1, 0.0),
        vec3(0.5, 0.1, 0.0),
        vec3(0.4, 0.2, 0.0),
        vec3(0.3, 0.2, 0.0),
        vec3(0.4, 0.1, 0.0),
        vec3(0.3, 0.1, 0.0)
    ];

    var backVertices = frontVertices.map(v => vec3(v[0], v[1], v[2]-depth));

    var sideVertices = [];

    function createSide(num1, num2) {
        sideVertices.push(frontVertices[num1], frontVertices[num2], backVertices[num1]);
        sideVertices.push(backVertices[num1], backVertices[num2], frontVertices[num2]);
    }

    // Y
    createSide(0, 1);
    createSide(1, 3);
    createSide(2, 4);
    createSide(4, 5);
    createSide(5, 3);
    createSide(7, 9);
    createSide(9, 8);
    createSide(8, 6);
    createSide(2, 0);

    // J
    createSide(10, 12);
    createSide(12, 15);
    createSide(15, 16);
    createSide(16, 18);
    createSide(18, 20);
    createSide(20, 21);
    createSide(21, 19);
    createSide(19, 17);
    createSide(17, 14);
    createSide(14, 11);
    createSide(11, 10);

    // P
    createSide(22, 23);
    createSide(23, 25);
    createSide(25, 26);
    createSide(28, 30);
    createSide(30, 32);
    createSide(32, 33);
    createSide(33, 22);
    createSide(36, 27);
    createSide(27, 29);
    createSide(29, 31);
    createSide(31, 36);

    vertices = frontVertices.concat(backVertices, sideVertices);

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

    const mv3x3 = mat3(
        modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2],
        modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2],
        modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2]
    );
    const normalMatrix = transpose(inverse(mv3x3));
    console.log("Normal Matrix:", normalMatrix);    

    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    let normals = computeNormals(vertices);

    let nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

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

function determinant(mat) {
    if (mat.length === 3 && mat[0].length === 3) {
        return mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
               mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
               mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
    }
    return null;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.enable( gl.DEPTH_TEST );

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    gl.drawArrays( gl.TRIANGLES, 1, 3 );
    gl.drawArrays( gl.TRIANGLES, 2, 3 );
    gl.drawArrays( gl.TRIANGLES, 3, 3 );
    gl.drawArrays( gl.TRIANGLES, 6, 3 );
    gl.drawArrays( gl.TRIANGLES, 7, 3 );
    gl.drawArrays( gl.TRIANGLES, 10, 3 );
    gl.drawArrays( gl.TRIANGLES, 11, 3 );
    gl.drawArrays( gl.TRIANGLES, 13, 3 );
    gl.drawArrays( gl.TRIANGLES, 14, 3 );
    gl.drawArrays( gl.TRIANGLES, 16, 3 );
    gl.drawArrays( gl.TRIANGLES, 17, 3 );
    gl.drawArrays( gl.TRIANGLES, 18, 3 );
    gl.drawArrays( gl.TRIANGLES, 19, 3 );
    gl.drawArrays( gl.TRIANGLES, 22, 3 );
    gl.drawArrays( gl.TRIANGLES, 23, 3 );
    gl.drawArrays( gl.TRIANGLES, 26, 3 );
    gl.drawArrays( gl.TRIANGLES, 27, 3 );
    gl.drawArrays( gl.TRIANGLES, 28, 3 );
    gl.drawArrays( gl.TRIANGLES, 29, 3 );
    gl.drawArrays( gl.TRIANGLES, 30, 3 );
    gl.drawArrays( gl.TRIANGLES, 31, 3 );
    gl.drawArrays( gl.TRIANGLES, 33, 3 );
    gl.drawArrays( gl.TRIANGLES, 34, 3 );

    gl.drawArrays( gl.TRIANGLES, 37, 3 );
    gl.drawArrays( gl.TRIANGLES, 38, 3 );
    gl.drawArrays( gl.TRIANGLES, 39, 3 );
    gl.drawArrays( gl.TRIANGLES, 40, 3 );
    gl.drawArrays( gl.TRIANGLES, 43, 3 );
    gl.drawArrays( gl.TRIANGLES, 44, 3 );
    gl.drawArrays( gl.TRIANGLES, 47, 3 );
    gl.drawArrays( gl.TRIANGLES, 48, 3 );
    gl.drawArrays( gl.TRIANGLES, 50, 3 );
    gl.drawArrays( gl.TRIANGLES, 51, 3 );
    gl.drawArrays( gl.TRIANGLES, 53, 3 );
    gl.drawArrays( gl.TRIANGLES, 54, 3 );
    gl.drawArrays( gl.TRIANGLES, 55, 3 );
    gl.drawArrays( gl.TRIANGLES, 56, 3 );
    gl.drawArrays( gl.TRIANGLES, 59, 3 );
    gl.drawArrays( gl.TRIANGLES, 60, 3 );
    gl.drawArrays( gl.TRIANGLES, 63, 3 );
    gl.drawArrays( gl.TRIANGLES, 64, 3 );
    gl.drawArrays( gl.TRIANGLES, 65, 3 );
    gl.drawArrays( gl.TRIANGLES, 66, 3 );
    gl.drawArrays( gl.TRIANGLES, 67, 3 );
    gl.drawArrays( gl.TRIANGLES, 68, 3 );
    gl.drawArrays( gl.TRIANGLES, 70, 3 );
    gl.drawArrays( gl.TRIANGLES, 71, 3 );

    for (let i = 74; i < vertices.length; i += 3 ) {
        gl.drawArrays( gl.TRIANGLES, i, 3);
    }

    requestAnimationFrame(render); 
}

window.setCameraView = setCameraView;