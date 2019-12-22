// UI --- Raton
let ratonAbajo = false;
let posRatonX = null;
let posRatonY = null;

let scale = SCALE_INIT;
let check = false;

let lightOnOff = [1,1,1];



/*********************** RATON Y TECLADO: Funciones de control del Movimiento y Rotación***/
/* Deteccion de eventos*/

function deteccionEventos() {
  canvas.addEventListener("mousedown", pulsaRatonAbajo);
  window.addEventListener("resize", resize_canvas);
  document.addEventListener("mouseup", pulsaRatonArriba);
  document.addEventListener("mousemove", mueveRaton);
  document.addEventListener("keydown", pulsaTecla);
  document.addEventListener("keyup", arrivaTecla);
  window.addEventListener("wheel", mueveRueda);

  let rotate = document.getElementById("rotate");
  rotate.addEventListener("change", changeRotationType);

  let lightColor = document.getElementById("rotateColor");
  lightColor.addEventListener("input", changeLightColor);

  let amCheck = document.getElementById("ambientCheck");
  let diCheck = document.getElementById("diffuseCheck");
  let spCheck = document.getElementById("specularCheck");

  amCheck.addEventListener("change", (e)=>lightOnOff[0]=e.target.checked);
  diCheck.addEventListener("change", (e)=>lightOnOff[1]=e.target.checked);
  spCheck.addEventListener("change", (e)=>lightOnOff[2]=e.target.checked);

}
/* Gestion de ventos*/

function changeLightColor(e){
  let color = [...hexToRgb(e.target.value),1];
  light.ambientColor = color.slice();
  light.diffuseColor = color.slice();
  light.specularColor = color.slice();
}




function changeRotationType(event){
  check = event.target.checked;
}


function resize_canvas(){
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth*MULTISAMPLING;
  canvas.height = window.innerHeight*MULTISAMPLING;
  gl.viewport(0, 0, canvas.width, canvas.height);
  // console.log(canvas.width, canvas.height);

  SMatrix = reshapeMatrix([2000/canvas.width, 2000/canvas.height, 1]);
}

function mueveRueda(event) {

  var delta = Math.max(-1,Math.min(1,event.deltaY))/10+1;

  if(scale*delta<SCALE_MAX && scale*delta>SCALE_MIN){

    let n = Math.sqrt(camera.eye.map((x)=>x**2).reduce((x,y)=>x+y));
    camera.eye = camera.eye.map((x)=>x/n*scale);
  }

  scale = Math.min(SCALE_MAX,Math.max(SCALE_MIN,
    scale*delta));

  // console.log(`FOV: ${camera.fov_y} Aspect: ${camera.aspect}`);
  // console.log(`Camera: ${camera.eye}`);

}

function pulsaRatonAbajo(event) {
  ratonAbajo = true;
  posRatonX = event.clientX;
  posRatonY = event.clientY;
}

function pulsaRatonArriba(event) {
  ratonAbajo = false;
}

function mueveRaton(event) {
  if (!ratonAbajo) {
    return;
  }
  let nuevaX = event.clientX;
  let nuevaY = event.clientY;
  let deltaX = (nuevaX - posRatonX);
  let deltaY = (nuevaY - posRatonY);
  let idMatrix = mat4.create();





  if(!check){
    mat4.rotate(idMatrix, idMatrix, degToRad(deltaX / 2), camera.up);
    mat4.rotate(idMatrix, idMatrix, degToRad(deltaY / 2), camera.lateral);
    mat4.multiply(MvMatrix, idMatrix, MvMatrix);  // console.log(`Camera: ${camera.eye}`);
  } else {
    mat4.rotate(idMatrix, idMatrix, degToRad(-deltaX / 2), camera.up);
    mat4.rotate(idMatrix, idMatrix, degToRad(-deltaY / 2), camera.lateral);

    let pos = vec4.fromValues(...camera.eye,1);
    vec4.transformMat4(pos, pos, idMatrix);
    camera.eye = [pos[0],pos[1],pos[2]];

    pos = vec4.fromValues(...camera.up,1);
    vec4.transformMat4(pos, pos, idMatrix);
    camera.up = [pos[0],pos[1],pos[2]];

    pos = vec4.fromValues(...camera.lateral,1);
    vec4.transformMat4(pos, pos, idMatrix);
    camera.lateral = [pos[0],pos[1],pos[2]];

    console.log(`Camera: ${camera.eye}`);
  }

  //console.log(`TARGET: ${vec}`);

  posRatonX = nuevaX;
  posRatonY = nuevaY;
}


function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function pulsaTecla(event) {
  switch (event.keyCode) {
    case 81:
      camera.fov_y += sn, m;
      break; // The right arrow key was pressed
    case 87:
      camera.fov_y -= sn, m;
      break; // The left arrow key was pressed
    case 69:
      camera.aspect += sf, m;
      break; // The up arrow key was pressed
    case 82:
      camera.aspect -= sf, m;
      break; // The down arrow key was pressed
  }
}

function arrivaTecla() {
  console.log(`FOV: ${camera.fov_y} Aspect: ${camera.aspect}`);
  console.log(`Camera: ${camera.eye}`);
}
