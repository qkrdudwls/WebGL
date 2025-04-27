"use strict";

let gl;
const depth = 0.1;
let theta = [0, 0, 0];
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = 0;

let vertices = [];

window.onload = function init()
{
    let canvas = document.getElementById( "glCanvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL is not available" ); }

    var frontVertices = [
        // Y
        vec3(-0.5, 0.2, 0.0),
        vec3(-0.4, 0.2, 0.0),
        vec3(-0.35, 0.1, 0.0),
        vec3(-0.3, 0.2, 0.0),
        vec3(-0.2, 0.2, 0.0),
        vec3(-0.3, 0.0, 0.0),
        vec3(-0.3, -0.2, 0.0),
        vec3(-0.4, -0.2, 0.0),
        vec3(-0.4, 0.0, 0.0),

        // J
        vec3(-0.1, 0.2, 0.0),
        vec3(0.2, 0.2, 0.0),
        vec3(0.2, -0.1, 0.0),
        vec3(0.1, -0.2, 0.0),
        vec3(0.0, -0.2, 0.0),
        vec3(-0.1, -0.1, 0.0),
        vec3(-0.1, 0.0, 0.0),
        vec3(0.0, -0.1, 0.0),
        vec3(0.1, -0.1, 0.0),
        vec3(0.1, 0.1, 0.0),
        vec3(-0.1, 0.1, 0.0),

        // P
        vec3(0.3, 0.2, 0.0),
        vec3(0.3, -0.2, 0.0),
        vec3(0.4, -0.2, 0.0),
        vec3(0.4, -0.1, 0.0),
        vec3(0.5, -0.1, 0.0),
        vec3(0.6, 0.0, 0.0),
        vec3(0.6, 0.1, 0.0),
        vec3(0.5, 0.2, 0.0),
        vec3(0.4, 0.2, 0.0),
        vec3(0.4, 0.1, 0.0),
        vec3(0.4, 0.0, 0.0),
        vec3(0.5, 0.0, 0.0),
        vec3(0.5, 0.1, 0.0)
    ];

    var backVertices = frontVertices.map(v => vec3(v[0], v[1], v[2]-depth));

    var sideVertices = [];

    function createSideVertices(num) {
        sideVertices.push(frontVertices[num], backVertices[num]);
    }

    for(let i = 0; i <= 29; i++) {
        createSideVertices(i);
    }

    vertices = frontVertices.concat(backVertices, sideVertices);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1., 1., 1.0, 1.0 );

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    let modelViewMatrix = lookAt(vec3(0.0, 0.0, 1.5), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    let projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 10.0);

    let modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
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
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.LINE_LOOP, 0, 9 );
    gl.drawArrays( gl.LINE_LOOP, 9, 11 );
    gl.drawArrays( gl.LINE_LOOP, 20, 9 );
    gl.drawArrays( gl.LINE_LOOP, 29, 4 );

    gl.drawArrays( gl.LINE_LOOP, 33, 9 );
    gl.drawArrays( gl.LINE_LOOP, 42, 11 );
    gl.drawArrays( gl.LINE_LOOP, 53, 9 );
    gl.drawArrays( gl.LINE_LOOP, 62, 4 );

    for(let i = 66; i < vertices.length; i += 2) {
        gl.drawArrays( gl.LINE_LOOP, i, 2 );
    }

}
