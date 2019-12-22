let mat4 = glMatrix.mat4;
let mat3 = glMatrix.mat4;
let vec3 = glMatrix.vec3;
let vec4 = glMatrix.vec4;


// ****************** Variables Globales ******
let gl = null,
  canvas = null,
  glProgram = null,
  fragmentShader = null,
  vertexShader = null;

//-- Atributos y buffers
let positionAttrib = null,
  textureAttrib = null,
  normalAttrib = null,
  vertexBuffer = null;


//-- Matrices rotacion y proyeccion --
let TMatrix = null, // Matriz posicion
  MvMatrix = null, // Matriz rotacion
  SMatrix = null, // Escalado pantalla
  CMatrix = null, // Movimiento camara
  PMatrix = null; // Matrix projeccion

// Atributos shaders, Matrices
let uTMatrix = null,
  uMvMatrix = null,
  uSMatrix = null,
  uCMatrix = null,
  uPMatrix = null;

let uPointPos = null,
  uAttenuation = null,
  uPointExponent = null,
  uPointCutoff = null,
  uAmbientProd = null,
  uDiffuseProd = null,
  uSpecularProd = null,
  uShininess = null,
  uTextureLocation = null;


let shininess, products;





/********************* 0. UTILIDADES **************************************/


/******   FunCiones de inicialización de matrices  ********* */

function inicializarMatrices() {
  PMatrix = mat4.create();
  mat4.perspective(PMatrix, camera.fov_y, camera.aspect, camera.near, camera.far);

  CMatrix = mat4.create();
  mat4.lookAt(CMatrix, camera.eye, camera.target, camera.up);

  TMatrix = translateMatrix([0, 0, 0]);
  MvMatrix = reshapeMatrix(SHAPE_DEFAULT);
  SMatrix = reshapeMatrix([2000 / canvas.width, 2000 / canvas.height, 1]);
}

function reshapeMatrix(shape) {
  let idMatrix = mat4.create();
  let v = vec3.create();

  vec3.set(v, ...shape);
  mat4.fromScaling(idMatrix, v);
  return idMatrix;
}

function translateMatrix(pos) {

  let idMatrix = mat4.create();
  let v = vec3.create();
  vec3.set(v, ...pos);
  mat4.fromTranslation(idMatrix, v);

  return idMatrix;
}

function* toggleRotation(rot,mat){
  if(rot) yield mat
  else {
    let i = mat4.create();
    mat4.identity(i);
    yield i;
  }
  yield mat;
}



/********************* 1. INIT WEBGL **************************************/
function initWebGL() {

  canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl", {
    antialias: true,
  });

  let antialias = gl.getContextAttributes().antialias;

  let size = gl.getParameter(gl.SAMPLES);
  console.log("Antialias: ", antialias, size);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (gl) {

    setupWebGL();
    initShaders();
    deteccionEventos();
    setupBuffers();
    setupLocations();
    setupTextures();
    drawScene();
    animacion();
  } else {
    alert("El navegador no soporta WEBGL.");
  }
}
/********************* 2.setup WEBGL **************************************/
function setupWebGL() {
  //Pone el color de fondo a verde ---para 2d no funciona
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //Crea un viewport del tamaño del canvas
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth * MULTISAMPLING;
  canvas.height = window.innerHeight * MULTISAMPLING;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Modo ON DEPTH
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  //Inicializarmatrices de movimiento
  inicializarMatrices();

  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.FRONT);




}
/********************* 3. INIT SHADER **************************************/
function initShaders() {
  // Esta función inicializa los shaders

  //1.Obtengo la referencia de los shaders
  let vs_source = document.getElementById('vertex-shader').innerHTML;
  let fs_source = document.getElementById('fragment-shader').innerHTML;


  //2. Compila los shaders
  vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
  fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

  //3. Crea un programa
  glProgram = gl.createProgram();


  //4. Adjunta al programa cada shader
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);

  gl.useProgram(glProgram);

  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    alert("No se puede inicializar el Programa .");
  }


}

/********************* 3.1. MAKE SHADER **************************************/
function makeShader(src, type) {
  //Compila cada  shader
  let shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
  }
  return shader;
}

/********************* 5. SETUP BUFFERS  **************************************/
function setupBuffers() {

  console.log("Objects: ", objects);

  let interleaved = [];
  let offset = 0;
  for (let n in objects) {
    let obj_list = objects[n];
    let size = 0;
    for (obj of obj_list.data) {
      for (let i = 0; i < obj.vertex.length / 3; i++)
        interleaved.push(
          ...obj.vertex.slice(i * 3, i * 3 + 3),
          ...obj.texture.slice(i * 3, i * 3 + 3),
          ...obj.normal.slice(i * 3, i * 3 + 3),
        );
      size += obj.vertex.length / 3;
    }
    obj_list.offset = offset;
    obj_list.size = size;
    offset += size * 3 *3;
  }

  //BUFFER PARA POSICIONES DEL PRISMA
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(interleaved), gl.STATIC_DRAW);
}

function setupLocations() {
  //Busca dónde debe ir la posicion de los vértices en el programa.
  positionAttrib = gl.getAttribLocation(glProgram, "aVertexPosition");
  textureAttrib = gl.getAttribLocation(glProgram, "aVertexTexture");
  normalAttrib = gl.getAttribLocation(glProgram, "aVertexNormal");

  // Localiza la matriz en el glProgram
  uTMatrix = gl.getUniformLocation(glProgram, 'uTMatrix');
  uMvMatrix = gl.getUniformLocation(glProgram, 'uMvMatrix');
  uSMatrix = gl.getUniformLocation(glProgram, 'uSMatrix');
  uCMatrix = gl.getUniformLocation(glProgram, 'uCMatrix');
  uPMatrix = gl.getUniformLocation(glProgram, 'uPMatrix');


  uPointPos = gl.getUniformLocation(glProgram, 'lightPosition');
  // uAttenuation = gl.getUniformLocation(glProgram, 'uMvMatrix');
  // uPointExponent = gl.getUniformLocation(glProgram, 'uMvMatrix');
  // uPointCutoff = gl.getUniformLocation(glProgram, 'uMvMatrix');
  uAmbientProd = gl.getUniformLocation(glProgram, 'ambientProduct');
  uDiffuseProd = gl.getUniformLocation(glProgram, 'diffuseProduct');
  uSpecularProd = gl.getUniformLocation(glProgram, 'specularProduct');
  uShininess = gl.getUniformLocation(glProgram, 'shininess');

  uTextureLocation = gl.getUniformLocation(glProgram, "u_texture");

}

function setupTextures() {
  let texts = {};
  for (n in TEXTURES)
    texts[n] = loadImageAndCreateTextureInfo(TEXTURES[n]);
  for (n in objects)
    objects[n].texture = texts[objects[n].type];
}

function loadImageAndCreateTextureInfo(texture_data) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
    { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: texture_data.url_px },
    { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: texture_data.url_nx },
    { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: texture_data.url_py },
    { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: texture_data.url_ny },
    { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: texture_data.url_pz },
    { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: texture_data.url_nz },
  ];

  faceInfos.forEach((faceInfo) => {
    const { target, url } = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = texture_data.size;
    const height = texture_data.size;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.addEventListener('load', function () {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
    image.crossOrigin = "";
    image.src = url;

  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  return texture;
}


/********************* 6. SETUP DYNAMIC BUFFERS  **************************************/
function setupDynamicBuffers() {
  CMatrix = mat4.create();
  mat4.lookAt(CMatrix, camera.eye, camera.target, camera.up);
}

/********************* 7. Draw Scene        *********************************** */
function drawScene() {
  gl.clearColor(...BACKGROUND_COLOR.map((x) => x / 256));
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (n in objects)
    drawObject(objects[n]);

}

function drawObject(obj) {
  products = calcLightProducts(light, MATERIALS_PROPERTIES[obj.material], lightOnOff);
  shininess = MATERIALS_PROPERTIES[obj.material].SHININESS;
  TMatrix = translateMatrix(obj.position);
  let rot= toggleRotation(obj.rotate, MvMatrix);
  MvMatrix = rot.next().value;

  setUniforms();
  setAttribs(obj.offset);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, obj.texture);

  gl.drawArrays(gl.TRIANGLES, 0, obj.size);
  
  MvMatrix = rot.next().value;
}

function setUniforms() {
  gl.uniformMatrix4fv(uTMatrix, false, TMatrix);
  gl.uniformMatrix4fv(uMvMatrix, false, MvMatrix);
  gl.uniformMatrix4fv(uSMatrix, false, SMatrix);
  gl.uniformMatrix4fv(uCMatrix, false, CMatrix);
  gl.uniformMatrix4fv(uPMatrix, false, PMatrix);

  gl.uniform3fv(uPointPos, light.pointPosition);
  gl.uniform4fv(uAmbientProd, products.ambient);
  gl.uniform4fv(uDiffuseProd, products.diffuse);
  gl.uniform4fv(uSpecularProd, products.specular);
  gl.uniform1f(uShininess, shininess);

  gl.uniform1i(uTextureLocation, 0);
}

function setAttribs(offset) {
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.enableVertexAttribArray(positionAttrib);
  gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, FLOAT_BYTES * 9, FLOAT_BYTES * offset);
  gl.enableVertexAttribArray(textureAttrib);
  gl.vertexAttribPointer(textureAttrib, 3, gl.FLOAT, false, FLOAT_BYTES * 9, FLOAT_BYTES * (3 + offset));
  gl.enableVertexAttribArray(normalAttrib);
  gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, FLOAT_BYTES * 9, FLOAT_BYTES * (6 + offset));
}


function animacion() {
  setupDynamicBuffers();
  drawScene();
  requestAnimationFrame(animacion);
}
