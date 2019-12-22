if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat',
    {
      value: function (depth = 1, stack = []) {
        for (let item of this) {
          if (item instanceof Array && depth > 0) {
            item.flat(depth - 1, stack);
          }
          else {
            stack.push(item);
          }
        }

        return stack;
      }
    });
}


function add(v1, v2) {
  return v1.map((x, i) => x + v2[i]);
}

function sub(v1, v2) {
  return v1.map((x, i) => x - v2[i]);
}


function rotate(v, ang, axis) {
  var x = v[0], y = v[1], z = v[2];
  var qr = Math.cos(ang / 2),
    qi = Math.sin(ang / 2) * axis[0],
    qj = Math.sin(ang / 2) * axis[1],
    qk = Math.sin(ang / 2) * axis[2];
  var xp = x * (1 - 2 * (qj ** 2 + qk ** 2)) + y * (2 * (qi * qj - qk * qr)) + z * (2 * (qi * qk + qj * qr));
  var yp = x * (2 * (qi * qj + qk * qr)) + y * (1 - 2 * (qi ** 2 + qk ** 2)) + z * (2 * (qj * qk - qi * qr));
  var zp = x * (2 * (qi * qk - qj * qr)) + y * (2 * (qj * qk + qi * qr)) + z * (1 - 2 * (qi ** 2 + qj ** 2));
  //console.log("OR",v,[xp,yp,zp]);
  return [xp, yp, zp];
}



function getRot(v) {
  return [
    0,
    -(v[2] == 0 ? 0 : Math.atan(v[2] / v[0])) + (v[0] < 0 ? Math.PI : 0),
    -Math.abs(Math.PI / 2 - Math.asin(v[1]))
  ];
}

function test() {

  console.log("ROT: ", getRot([1, 0, 0]).map((x) => x * 180 / Math.PI));
  console.log("ROT: ", getRot([0, 1, 0]).map((x) => x * 180 / Math.PI));
  console.log("ROT: ", getRot([0, 0, 1]).map((x) => x * 180 / Math.PI));

  console.log("ROT: ", getRot([0.5, 0.86602, 0]).map((x) => x * 180 / Math.PI));
  console.log("ROT: ", getRot([0, 0.5, 0.86602]).map((x) => x * 180 / Math.PI));
  console.log("ROT: ", getRot([-0.86602, 0.5, 0]).map((x) => x * 180 / Math.PI));

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min + 1)) + min;
}

var _seed = 0;

function Random(seed) {
  _seed = (seed * 100147483657) % 2147483647;
  if (_seed <= 0) _seed += 2147483646;

}

function random() {
  _seed = _seed * 16807 % 2147483647;
  return _seed / 2147483647;
};

function getNormal(va, vb, vc) {
  let A = vb.map((x, i) => x - va[i]);
  let B = vc.map((x, i) => x - va[i]);
  let N = cross(A, B); // this is the triangle's normal
  return N.map((x) => x / norm(N));
}

function cross(u, v) {
  var result = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0]
  ];
  return result;
}

function norm(v) {
  return Math.sqrt(v.map((x) => x ** 2).reduce((x, y) => x + y));
}

// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImages(texture_data) {

  const faceInfos = [
    { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: texture_data.url_px },
    { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: texture_data.url_nx },
    { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: texture_data.url_py },
    { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: texture_data.url_ny },
    { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: texture_data.url_pz },
    { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: texture_data.url_nz },
  ];

  faceInfos.forEach((faceInfo, i) => {
    const { target, url } = faceInfo;


    // Asynchronously load an image
    const image = new Image();
    image.addEventListener('load', function () {
      console.log("HEYO");
      // Now that the image has loaded make copy it to the texture.
      let ind = ((x) => (() => x))(i);
      console.log(ind());
      // faceInfos[ind]
    });
    image.addEventListener('error', imageNotFound);
    image.crossOrigin = "anonymous";
    image.src = url;
    faceInfos[i].image = image;
  });
  return faceInfos;
}

function imageNotFound(e) {
  console.log(e);
  console.log(e + 'That image was not found.');
}

function calcLightProducts(l, m, onoff) {
  return {
    ambient: l.ambientColor.map((x, i) => x * m.AMBIENT[i] * onoff[0]),
    diffuse: l.diffuseColor.map((x, i) => x * m.DIFFUSE[i] * onoff[1]),
    specular: l.specularColor.map((x, i) => x * m.SPECULAR[i] * onoff[2])
  }
}

function hexToRgb(hex) {
    var bigint = parseInt("0x"+hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r/256 , g/256, b/256];
}
