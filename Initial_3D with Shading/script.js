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
let eye = vec3(0.0, 0.0, 1.5);
let at = vec3(0.0, 0.0, 0.0);
let up = vec3(0.0, 1.0, 0.0);

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

    function createSide (num1, num2) {
        sideVertices.push(frontVertices[num1], frontVertices[num2], backVertices[num1]);
        sideVertices.push(backVertices[num1], backVertices[num2], frontVertices[num2]);
    }

    // Y
    createSide (0, 1);
    createSide (1, 3);
    createSide (2, 4);
    createSide (4, 5);
    createSide (5, 3);
    createSide (7, 9);
    createSide (9, 8);
    createSide (8, 6);
    createSide (2, 0);

    // J
    createSide (10, 12);
    createSide (12, 15);
    createSide (15, 16);
    createSide (16, 18);
    createSide (18, 20);
    createSide (20, 21);
    createSide (21, 19);
    createSide (19, 17);
    createSide (17, 14);
    createSide (14, 11);
    createSide (11, 10);

    // P
    createSide (22, 23);
    createSide (23, 25);
    createSide (25, 26);
    createSide (28, 30);
    createSide (30, 32);
    createSide (32, 33);
    createSide (33, 22);
    createSide (36, 27);
    createSide (27, 29);
    createSide (29, 31);
    createSide (31, 36);

    vertices = frontVertices.concat(backVertices, sideVertices);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1., 1., 1.0, 1.0 );

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    modelViewMatrix = lookAt(eye, at, up);
    let projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 10.0);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    let projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.enable( gl.DEPTH_TEST );

    modelViewMatrix = lookAt(eye, at, up);

    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    gl.drawArrays( gl.TRIANGLES, 1, 3 );
    gl.drawArrays( gl.TRIANGLES, 2, 3 );
    gl.drawArrays( gl.TRIANGLES, 3, 5 );
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
    gl.drawArrays( gl.TRIANGLES, 40, 5 );
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

    let translationMatrix = translate(translation[0], translation[1], translation[2]);
    let rotationMatrix = mat4();
    rotationMatrix = mult(rotationMatrix, rotateX(theta[xAxis]));
    rotationMatrix = mult(rotationMatrix, rotateY(theta[yAxis]));
    rotationMatrix = mult(rotationMatrix, rotateZ(theta[zAxis]));
    let scalingMatrix = scalem(scaleFactor, scaleFactor, scaleFactor);
    
    let transformMatrix = mat4();
    transformMatrix = mult(transformMatrix, scalingMatrix);
    transformMatrix = mult(transformMatrix, rotationMatrix);
    transformMatrix = mult(transformMatrix, translationMatrix);
    
    let finalMatrix = mult(modelViewMatrix, transformMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(finalMatrix));

    requestAnimationFrame(render); 
}
