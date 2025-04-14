"use strict";

let gl;
let delay = 10;
let theta = 0.0;
let thetaLoc;
let direction = true;
let start = false;

window.onload = function init()
{
    let canvas = document.getElementById( "glCanvas" );

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
        if (direction) {
            this.value = "To the Left";
            direction = false;
        } else {
            this.value = "To the Right";
            direction = true;
        }
    }

    document.getElementById( "Speed" ).onclick = function () {
        delay = parseInt(this.value);
    }

    window.onkeydown = function ( event ) {
        let key = String.fromCharCode( event.keyCode );
        switch(key) {
            case 'A':
                direction = true;
                document.getElementById( "Direction" ).value = "To the Right";
                break;
            case 'D':
                direction = false;
                document.getElementById( "Direction" ).value = "To the Left";
                break;
        }
    }

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL is not available" ); }

    var vertices = [
        // Y (Front)
        vec4(-0.5, 0.2, 0.0, 1.0),
        vec4(-0.4, 0.0, 0.0, 1.0),
        vec4(-0.4, 0.2, 0.0, 1.0),
        vec4(-0.3, 0.0, 0.0, 1.0),
        vec4(-0.2, 0.2, 0.0, 1.0),
        vec4(-0.3, 0.2, 0.0, 1.0),
        vec4(-0.4, 0.0, 0.0, 1.0),
        vec4(-0.3, 0.0, 0.0, 1.0),
        vec4(-0.4, -0.2, 0.0, 1.0),
        vec4(-0.3, -0.2, 0.0, 1.0),

        // Y (Back)
        vec4(-0.5, 0.2, -0.05, 1.0),
        vec4(-0.4, 0.0, -0.05, 1.0),
        vec4(-0.4, 0.2, -0.05, 1.0),
        vec4(-0.3, 0.0, -0.05, 1.0),
        vec4(-0.2, 0.2, -0.05, 1.0),
        vec4(-0.3, 0.2, -0.05, 1.0),
        vec4(-0.4, 0.0, -0.05, 1.0),
        vec4(-0.3, 0.0, -0.05, 1.0),
        vec4(-0.4, -0.2, -0.05, 1.0),
        vec4(-0.3, -0.2, -0.05, 1.0),

        // J (Front)
        vec4(-0.1, 0.2, 0.0, 1.0),
        vec4(-0.1, 0.1, 0.0, 1.0),
        vec4(0.2, 0.2, 0.0, 1.0),
        vec4(0.2, 0.1, 0.0, 1.0),
        vec4(0.1, 0.1, 0.0, 1.0),
        vec4(0.2, -0.1, 0.0, 1.0),
        vec4(0.1, -0.1, 0.0, 1.0),
        vec4(0.1, -0.2, 0.0, 1.0),
        vec4(0.0, -0.1, 0.0, 1.0),
        vec4(0.0, -0.2, 0.0, 1.0),
        vec4(-0.1, -0.1, 0.0, 1.0),
        vec4(-0.1, 0.0, 0.0, 1.0),
        vec4(0.0, -0.1, 0.0, 1.0),

        // J (Back)
        vec4(-0.1, 0.2, -0.05, 1.0),
        vec4(-0.1, 0.1, -0.05, 1.0),
        vec4(0.2, 0.2, -0.05, 1.0),
        vec4(0.2, 0.1, -0.05, 1.0),
        vec4(0.1, 0.1, -0.05, 1.0),
        vec4(0.2, -0.1, -0.05, 1.0),
        vec4(0.1, -0.1, -0.05, 1.0),
        vec4(0.1, -0.2, -0.05, 1.0),
        vec4(0.0, -0.1, -0.05, 1.0),
        vec4(0.0, -0.2, -0.05, 1.0),
        vec4(-0.1, -0.1, -0.05, 1.0),
        vec4(-0.1, 0.0, -0.05, 1.0),
        vec4(0.0, -0.1, -0.05, 1.0),

        // P (Front)
        vec4(0.3, 0.2, 0.0, 1.0),
        vec4(0.3, -0.2, 0.0, 1.0),
        vec4(0.4, 0.2, 0.0, 1.0),
        vec4(0.4, -0.2, 0.0, 1.0),
        vec4(0.4, -0.1, 0.0, 1.0),
        vec4(0.4, 0.0, 0.0, 1.0),
        vec4(0.5, -0.1, 0.0, 1.0),
        vec4(0.5, 0.0, 0.0, 1.0),
        vec4(0.6, 0.0, 0.0, 1.0),
        vec4(0.5, 0.1, 0.0, 1.0),
        vec4(0.6, 0.1, 0.0, 1.0),
        vec4(0.5, 0.2, 0.0, 1.0),
        vec4(0.4, 0.2, 0.0, 1.0),
        vec4(0.5, 0.1, 0.0, 1.0),
        vec4(0.4, 0.1, 0.0, 1.0),

        // P (Back)
        vec4(0.3, 0.2, -0.05, 1.0),
        vec4(0.3, -0.2, -0.05, 1.0),
        vec4(0.4, 0.2, -0.05, 1.0),
        vec4(0.4, -0.2, -0.05, 1.0),
        vec4(0.4, -0.1, -0.05, 1.0),
        vec4(0.4, 0.0, -0.05, 1.0),
        vec4(0.5, -0.1, -0.05, 1.0),
        vec4(0.5, 0.0, -0.05, 1.0),
        vec4(0.6, 0.0, -0.05, 1.0),
        vec4(0.5, 0.1, -0.05, 1.0),
        vec4(0.6, 0.1, -0.05, 1.0),
        vec4(0.5, 0.2, -0.05, 1.0),
        vec4(0.4, 0.2, -0.05, 1.0),
        vec4(0.5, 0.1, -0.05, 1.0),
        vec4(0.4, 0.1, -0.05, 1.0)        
    ];

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1., 1., 1.0, 1.0 );

    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(thetaLoc, theta);

    // Y (Front)
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 3, 3);
    gl.drawArrays(gl.TRIANGLES, 6, 3);

    // Y (Back)
    gl.drawArrays(gl.TRIANGLES, 10, 3);
    gl.drawArrays(gl.TRIANGLES, 13, 3);
    gl.drawArrays(gl.TRIANGLES, 16, 3);

    // Y (Sides)
    gl.drawArrays(gl.TRIANGLES, 0, 1); gl.drawArrays(gl.TRIANGLES, 10, 1); gl.drawArrays(gl.TRIANGLES, 1, 1);
    gl.drawArrays(gl.TRIANGLES, 1, 1); gl.drawArrays(gl.TRIANGLES, 10, 1); gl.drawArrays(gl.TRIANGLES, 11, 1);
    gl.drawArrays(gl.TRIANGLES, 2, 1); gl.drawArrays(gl.TRIANGLES, 12, 1); gl.drawArrays(gl.TRIANGLES, 3, 1);
    gl.drawArrays(gl.TRIANGLES, 3, 1); gl.drawArrays(gl.TRIANGLES, 12, 1); gl.drawArrays(gl.TRIANGLES, 13, 1);
    gl.drawArrays(gl.TRIANGLES, 4, 1); gl.drawArrays(gl.TRIANGLES, 14, 1); gl.drawArrays(gl.TRIANGLES, 5, 1);
    gl.drawArrays(gl.TRIANGLES, 5, 1); gl.drawArrays(gl.TRIANGLES, 14, 1); gl.drawArrays(gl.TRIANGLES, 15, 1);
    gl.drawArrays(gl.TRIANGLES, 6, 1); gl.drawArrays(gl.TRIANGLES, 16, 1); gl.drawArrays(gl.TRIANGLES, 7, 1);
    gl.drawArrays(gl.TRIANGLES, 7, 1); gl.drawArrays(gl.TRIANGLES, 16, 1); gl.drawArrays(gl.TRIANGLES, 17, 1);
    gl.drawArrays(gl.TRIANGLES, 8, 1); gl.drawArrays(gl.TRIANGLES, 18, 1); gl.drawArrays(gl.TRIANGLES, 9, 1);
    gl.drawArrays(gl.TRIANGLES, 9, 1); gl.drawArrays(gl.TRIANGLES, 18, 1); gl.drawArrays(gl.TRIANGLES, 19, 1);

    // J (Front)
    gl.drawArrays(gl.TRIANGLES, 20, 3);
    gl.drawArrays(gl.TRIANGLES, 23, 3);
    gl.drawArrays(gl.TRIANGLES, 26, 3);
    gl.drawArrays(gl.TRIANGLES, 29, 3);

    // J (Back)
    gl.drawArrays(gl.TRIANGLES, 32, 3);
    gl.drawArrays(gl.TRIANGLES, 35, 3);
    gl.drawArrays(gl.TRIANGLES, 38, 3);
    gl.drawArrays(gl.TRIANGLES, 41, 3);

    // J (Sides)
    gl.drawArrays(gl.TRIANGLES, 20, 1); gl.drawArrays(gl.TRIANGLES, 32, 1); gl.drawArrays(gl.TRIANGLES, 21, 1);
    gl.drawArrays(gl.TRIANGLES, 21, 1); gl.drawArrays(gl.TRIANGLES, 32, 1); gl.drawArrays(gl.TRIANGLES, 33, 1);
    gl.drawArrays(gl.TRIANGLES, 22, 1); gl.drawArrays(gl.TRIANGLES, 34, 1); gl.drawArrays(gl.TRIANGLES, 23, 1);
    gl.drawArrays(gl.TRIANGLES, 23, 1); gl.drawArrays(gl.TRIANGLES, 34, 1); gl.drawArrays(gl.TRIANGLES, 35, 1);
    gl.drawArrays(gl.TRIANGLES, 24, 1); gl.drawArrays(gl.TRIANGLES, 36, 1); gl.drawArrays(gl.TRIANGLES, 25, 1);
    gl.drawArrays(gl.TRIANGLES, 25, 1); gl.drawArrays(gl.TRIANGLES, 36, 1); gl.drawArrays(gl.TRIANGLES, 37, 1);
    gl.drawArrays(gl.TRIANGLES, 26, 1); gl.drawArrays(gl.TRIANGLES, 38, 1); gl.drawArrays(gl.TRIANGLES, 27, 1);
    gl.drawArrays(gl.TRIANGLES, 27, 1); gl.drawArrays(gl.TRIANGLES, 38, 1); gl.drawArrays(gl.TRIANGLES, 39, 1);
    gl.drawArrays(gl.TRIANGLES, 28, 1); gl.drawArrays(gl.TRIANGLES, 40, 1); gl.drawArrays(gl.TRIANGLES, 29, 1);
    gl.drawArrays(gl.TRIANGLES, 29, 1); gl.drawArrays(gl.TRIANGLES, 40, 1); gl.drawArrays(gl.TRIANGLES, 41, 1);

    // P (Front)
    gl.drawArrays(gl.TRIANGLES, 44, 3);
    gl.drawArrays(gl.TRIANGLES, 47, 3);
    gl.drawArrays(gl.TRIANGLES, 50, 3);

    // P (Back)
    gl.drawArrays(gl.TRIANGLES, 58, 3);
    gl.drawArrays(gl.TRIANGLES, 61, 3);
    gl.drawArrays(gl.TRIANGLES, 64, 3);

    // P (Sides)
    gl.drawArrays(gl.TRIANGLES, 44, 1); gl.drawArrays(gl.TRIANGLES, 58, 1); gl.drawArrays(gl.TRIANGLES, 45, 1);
    gl.drawArrays(gl.TRIANGLES, 45, 1); gl.drawArrays(gl.TRIANGLES, 58, 1); gl.drawArrays(gl.TRIANGLES, 59, 1);
    gl.drawArrays(gl.TRIANGLES, 46, 1); gl.drawArrays(gl.TRIANGLES, 60, 1); gl.drawArrays(gl.TRIANGLES, 47, 1);
    gl.drawArrays(gl.TRIANGLES, 47, 1); gl.drawArrays(gl.TRIANGLES, 60, 1); gl.drawArrays(gl.TRIANGLES, 61, 1);
    gl.drawArrays(gl.TRIANGLES, 48, 1); gl.drawArrays(gl.TRIANGLES, 62, 1); gl.drawArrays(gl.TRIANGLES, 49, 1);
    gl.drawArrays(gl.TRIANGLES, 49, 1); gl.drawArrays(gl.TRIANGLES, 62, 1); gl.drawArrays(gl.TRIANGLES, 63, 1);
    gl.drawArrays(gl.TRIANGLES, 50, 1); gl.drawArrays(gl.TRIANGLES, 64, 1); gl.drawArrays(gl.TRIANGLES, 51, 1);
    gl.drawArrays(gl.TRIANGLES, 51, 1); gl.drawArrays(gl.TRIANGLES, 64, 1); gl.drawArrays(gl.TRIANGLES, 65, 1);

    if (start) {
        if (direction) {
            theta += 0.1;
        } else {
            theta -= 0.1;
        }
        setTimeout(function () {
            requestAnimationFrame(render);
        }, delay);
    }
}

