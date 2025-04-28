"use strict";

let gl;
const depth = 0.1;
let theta = [0, 0, 0];
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = -1;
let rotationDirection = 1;
let translation = [0, 0, 0];
let scaleFactor = 1.0;
let start = false;
let autoRotate = false;

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

    for(let i = 0; i <= 29; i++) {
        if (i == 28) { continue; }
        sideVertices.push(frontVertices[i], backVertices[i]);
    }

    vertices = frontVertices.concat(backVertices, sideVertices);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1., 1., 1.0, 1.0 );

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    document.getElementById( "lookat" ).onclick = function () {
        eye = vec3(
            parseFloat(document.getElementById( "eyeX" ).value),
            parseFloat(document.getElementById( "eyeY" ).value),
            parseFloat(document.getElementById( "eyeZ" ).value)
        );

        at = vec3(
            parseFloat(document.getElementById( "atX" ).value),
            parseFloat(document.getElementById( "atY" ).value),
            parseFloat(document.getElementById( "atZ" ).value)
        );

        up = vec3(
            parseFloat(document.getElementById( "upX" ).value),
            parseFloat(document.getElementById( "upY" ).value),
            parseFloat(document.getElementById( "upZ" ).value)
        );

        modelViewMatrix = lookAt(eye, at, up);
    }

    document.getElementById( "control" ).onclick = function () { 
        start = !start;
        if (start) {
            this.value = "Stop";
        } else {
            this.value = "Start";
        }
    };

    document.getElementById( "reset" ).onclick = function () {
        translation = [0, 0, 0];
        theta = [0, 0, 0];
        scaleFactor = 1.0;
        start = false;
        autoRotate = false;

        eye = vec3(0.0, 0.0, 1.5);
        at = vec3(0.0, 0.0, 0.0);
        up = vec3(0.0, 1.0, 0.0);

        modelViewMatrix = lookAt(eye, at, up);

        document.getElementById( "control" ).value = "Start";
        document.getElementById( "mode" ).value = "Auto";

        document.getElementById( "eyeX" ).value = 0.0;
        document.getElementById( "eyeY" ).value = 0.0;
        document.getElementById( "eyeZ" ).value = 1.5;
        document.getElementById( "atX" ).value = 0.0;
        document.getElementById( "atY" ).value = 0.0;
        document.getElementById( "atZ" ).value = 0.0;
        document.getElementById( "upX" ).value = 0.0;
        document.getElementById( "upY" ).value = 1.0;
        document.getElementById( "upZ" ).value = 0.0;
    }

    document.getElementById( "translateXNegative" ).onclick = function () { translation[0] -= 0.1; };
    document.getElementById( "translateXPositive" ).onclick = function () { translation[0] += 0.1; };
    document.getElementById( "translateYNegative" ).onclick = function () { translation[1] -= 0.1; };
    document.getElementById( "translateYPositive" ).onclick = function () { translation[1] += 0.1; };
    document.getElementById( "translateZNegative" ).onclick = function () { translation[2] -= 0.1; };
    document.getElementById( "translateZPositive" ).onclick = function () { translation[2] += 0.1; };

    document.getElementById( "rotateX" ).onclick = function () { 
        axis = xAxis;
        autoRotate = false;
        document.getElementById( "mode" ).value = "Auto";
    };
    document.getElementById( "rotateY" ).onclick = function () { 
        axis = yAxis;
        autoRotate = false;
        document.getElementById( "mode" ).value = "Auto"; 
    };
    document.getElementById( "rotateZ" ).onclick = function () { 
        axis = zAxis;
        autoRotate = false;
        document.getElementById( "mode" ).value = "Auto";
    };
    document.getElementById( "reverse" ).onclick = function () { rotationDirection *= -1; };
    document.getElementById( "mode" ).onclick = function () {
        autoRotate = !autoRotate;
        if (autoRotate) {
            this.value = "Manual";
        } else {
            this.value = "Auto";
        }
    }

    document.getElementById( "scaleUp" ).onclick = function () { scaleFactor *= 1.1; };
    document.getElementById( "scaleDown" ).onclick = function () { scaleFactor *= 0.9; };

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

    if (start) {
        theta[axis] += rotationDirection * 2.0;
    }

    if (autoRotate) {
        theta[0] += rotationDirection * 0.6;
        theta[1] += rotationDirection * 0.6;
        theta[2] += rotationDirection * 0.6;
    }

    let translationMatrix = translate(translation[0], translation[1], translation[2]);
    let rotationMatrix = mat4();
    rotationMatrix = mult(rotationMatrix, rotateX(theta[xAxis]));
    rotationMatrix = mult(rotationMatrix, rotateY(theta[yAxis]));
    rotationMatrix = mult(rotationMatrix, rotateZ(theta[zAxis]));
    let scalingMatrix = scalem(scaleFactor, scaleFactor, scaleFactor);

    let finalMatrix = mult(modelViewMatrix, mult(translationMatrix, mult(rotationMatrix, scalingMatrix)));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(finalMatrix));

    requestAnimationFrame(render);
}
