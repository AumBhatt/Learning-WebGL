var canvas = document.querySelector('#canvas');

main();

function main() {

    var gl = canvas.getContext('webgl');

    var vertexShaderSource = document.querySelector('#vertex-shader-2d').text;
    var fragmentShaderSource = document.querySelector('#fragment-shader-2d').text;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer which will contain out data.
    var positionBuffer = gl.createBuffer();
    // We bind the buffer to the bind points [WebGL's internal global variables].
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
        0, 0,
        0.5, 0,
        0, 0.5
    ];

    // Filling our buffer with vertex data.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

/* --------- Rendering --------- */

    // Use resizeCanvasToDisplay() in webglUtils to resize canvas on-the-fly with CSS.
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // gl.viewport() helps to convert clip-space values back to pixels which defines our screen-space containing gl_Position values.
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Setting background color of canvas / clearing canvas with a color.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Telling WebGL, which program to execute.
    gl.useProgram(program);
    
    // Instructing WebGL how to read data from buffer using a_position vertex attribute.
    gl.enableVertexAttribArray(positionAttributeLocation);


    var size = 2;
    /*
        size = 2
            => pick 2 values per iteration.
            => Only 2 values are taken for each vertex to draw (x, y).
    */
    
    var type = gl.FLOAT;    // type of data in buffer is 32bit float.
    var normalize = false;  // don't normalize the data.
    var stride = 0;         // move element by element. [stride * sizeof(type)].
    var offset = 0;         // starting location for reading from buffer. [0 = the very first location].
    
    // vertexAttribPointer() binds the current buffer to positionBuffer and helps free the ARRAY_BUFFER to be used by something
    // => We continue using the positionBuffer.
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset
    );

    var primitiveType = gl.TRIANGLES;  // Selecting triangle as our primitive shape.
    var offset = 0;                     // ?
    var count = 3;                      // Number of vertices

    // Finally, draw the shape.
    gl.drawArrays(primitiveType, offset, count);

}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}