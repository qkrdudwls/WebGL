"use strict";

let gl;
let delay = 0;
let theta = 0.0;
let thetaLoc;
let direction = true;
let start = false;

window.onload = function init()
{
    var canvas = document.getElementById( "glCanvas" );4

    document.getElementById( "Control" ).onclick = function () {
        start = !start;
        if (start) {
            this.value = "Stop";
            render();
        } else {
            this.value = "Start";
        }
    }

    document.getElementById( "Direction" ).onclick = function () {
        direction = !direction;
    }

    document.getElementById( "Speed" ).onclick = function () {
        delay = parseInt(this.value);
    }
    
    window.onkeydown = function (event) {
        let key = String.fromCharCode(event.keyCode);
        switch(key) {
            case 'A':
                direction = true;
                break;
            case 'D':
                direction = false;
                break;
        }
    }

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL is not available" ); }

    var vertices = [
        // Y
        vec2(-0.5, 0.2),
        vec2(-0.4, 0.0),
        vec2(-0.4, 0.2),
        vec2(-0.3, 0.0),
        vec2(-0.2, 0.2),
        vec2(-0.3, 0.2),
        vec2(-0.4, 0.0),
        vec2(-0.3, 0.0),
        vec2(-0.4, -0.2),
        vec2(-0.3, -0.2),

        // J
        vec2(-0.1, 0.2),
        vec2(-0.1, 0.1),
        vec2(0.2, 0.2),
        vec2(0.2, 0.1),
        vec2(0.1, 0.1),
        vec2(0.2, -0.1),
        vec2(0.1, -0.1),
        vec2(0.1, -0.2),
        vec2(0.0, -0.1),
        vec2(0.0, -0.2),
        vec2(-0.1, -0.1),
        vec2(-0.1, 0.0),
        vec2(0.0, -0.1),

        // P
        vec2(0.3, 0.2),
        vec2(0.3, -0.2),
        vec2(0.4, 0.2),
        vec2(0.4, -0.2),
        vec2(0.4, -0.1),
        vec2(0.4, 0.0),
        vec2(0.5, -0.1),
        vec2(0.5, 0.0),
        vec2(0.6, 0.0),
        vec2(0.5, 0.1),
        vec2(0.6, 0.1),
        vec2(0.5, 0.2),
        vec2(0.4, 0.2),
        vec2(0.5, 0.1),
        vec2(0.4, 0.1)
    ];

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1., 1., 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform1f( thetaLoc, theta );

    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    gl.drawArrays( gl.TRIANGLES, 1, 3 );
    gl.drawArrays( gl.LINES, 3, 2);
    gl.drawArrays( gl.LINES, 4, 2);
    gl.drawArrays( gl.TRIANGLES, 5, 3 );
    gl.drawArrays( gl.TRIANGLES, 6, 3 );
    gl.drawArrays( gl.TRIANGLES, 7, 3 );

    gl.drawArrays( gl.TRIANGLES, 10, 3 );
    gl.drawArrays( gl.TRIANGLES, 11, 3 );
    gl.drawArrays( gl.TRIANGLES, 13, 3 );
    gl.drawArrays( gl.TRIANGLES, 14, 3 );
    gl.drawArrays( gl.TRIANGLES, 15, 3 );
    gl.drawArrays( gl.TRIANGLES, 16, 3 );
    gl.drawArrays( gl.TRIANGLES, 17, 3 );
    gl.drawArrays( gl.LINES, 19, 2 );
    gl.drawArrays( gl.TRIANGLES, 20, 3 );

    gl.drawArrays( gl.TRIANGLES, 23, 3 );
    gl.drawArrays( gl.TRIANGLES, 24, 3 );
    gl.drawArrays( gl.TRIANGLES, 27, 3 );
    gl.drawArrays( gl.TRIANGLES, 28, 3 );
    gl.drawArrays( gl.TRIANGLES, 29, 3 );
    gl.drawArrays( gl.TRIANGLES, 30, 3 );
    gl.drawArrays( gl.TRIANGLES, 31, 3 );
    gl.drawArrays( gl.LINES, 33, 2 );
    gl.drawArrays( gl.TRIANGLES, 34, 3 );
    gl.drawArrays( gl.TRIANGLES, 35, 3 );

    if (start) {
        if (direction) {
            theta += 0.1;
        } else {
            theta -= 0.1;
        }      
        setTimeout(
            function () {requestAnimationFrame(render);}, delay 
        );
    };
}
