// CONSTANTES GLOBALES DEL PROYECTO

const FLOAT_BYTES = 4;

// Color fondo

const BACKGROUND_COLOR = [201, 212, 236, 256];


// Constantes prisma (tronco 3D)
const PRISM_RADIUS = 0.7,
  PRISM_LENGTH = 1,
  PRISM_N = 4;

const SCENE_SQUARE_POS = [
  [0, 0, 0], [0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0],
  [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
  [2, 0, 0], [2, 0, 1], [1, 0, 2], [0, 0, 2], [-1, 0, 2],
  [-2, 0, 1], [-2, 0, 0], [-2, 0, -1], [-2, 0, -2], [-1, 0, -2],
  [0, 0, -2], [1, 0, -2], [2, 0, -2],

  [-2, 1, -2], [-2, 1, -1], [-1, 1, -2],
  [-2, 2, -2],

]

// Constantes esfera
const SPHERE_RADIUS = 500,
  SPHERE_LONGITUDE = 5,
  SPHERE_LATITUDE = 20;
const SPHERE_RADIUS_SMALL = 0.25,
  SPHERE_LONGITUDE_SMALL = 200,
  SPHERE_LATITUDE_SMALL = 200;


// Limite de escalado de la vista
// var SCALE_INIT = 1,
//     SCALE_MAX = 6,
//     SCALE_MIN = 0.05;
const SCALE_INIT = 2,
  SCALE_MAX = 40,
  SCALE_MIN = 1;

const SHAPE_DEFAULT = [0.5, 0.5, 0.5];
const MULTISAMPLING = 4;



// Valores iniciales de la Camara
const CAMERA = {
  EYE: [0, 0.0, SCALE_INIT],
  TARGET: [0.0, 0.0, 0.0],
  UP: [0.0, 1.0, 0.0],
  LATERAL: [1.0, .0, .0],
  FOV_Y: 1.6,
  ASPECT: 1,
  NEAR: 0.1,
  FAR: 1000
}

// Valores iniciales de las luces
const LIGHT = {
  POINT_POSITION: [0, 0, 10],
  ATTENUATION: [.8, .8, .8], // Contante, lineal y cuadratica
  POINT_EXPONENT: 10,        // Srli
  POINT_CUTOFF: 0,
  AMBIENT_COLOR: [1, 1, 1, 1],
  DIFFUSE_COLOR: [1, 1, 1, 1],
  SPECULAR_COLOR: [1, 1, 1, 1],
}

const MATERIALS = {
  DIRT: "DIRT",
  SKY: "SKY",
  GOLD: "GOLD",
  JADE: "JADE",
  METAL: "METAL",
}


const MATERIALS_PROPERTIES = {
  DIRT: {
    AMBIENT: [0.4, 0.5, 0.4, 0.8],
    DIFFUSE: [0.54, 0.89, 0.63, 1],
    SPECULAR: [0.1, 0.1, 0.1, 2],
    SHININESS: 10,
  },
  SKY: {
    AMBIENT: [1, 1, 1, 1],
    DIFFUSE: [0, 0, 0, 1],
    SPECULAR: [0, 0, 0, 1],
    SHININESS: 1,
  },
  GOLD: {
    AMBIENT: [0.24725, 0.2245, 0.0645, 1.0],
    DIFFUSE: [0.34615, 0.3143, 0.0903, 1.0],
    SPECULAR: [0.797357, 0.723991, 0.208006, 1.0],
    SHININESS: 83.2
  },
  JADE: {
    AMBIENT: [0.135, 0.2225, 0.1575, 1],
    DIFFUSE: [0.54, 0.89, 0.63, 1],
    SPECULAR: [0.316228, 0.316228, 0.316228, 1],
    SHININESS: 12.8,
  },
  METAL: {
    AMBIENT: [0.5, 0.5, 0.5, 1],
    DIFFUSE: [0.1, 0.1, 0.1, 1],
    SPECULAR: [0.8, 0.8, 0.8, 1],
    SHININESS: 20,
  }
};



const TEXTURES = {
  DIRT: {
    size: 128,
    url_px: './resources/dirt/pz.png',
    url_nx: './resources/dirt/pz.png',
    url_py: './resources/dirt/py.png',
    url_ny: './resources/dirt/ny.png',
    url_pz: './resources/dirt/pz.png',
    url_nz: './resources/dirt/pz.png',
  },
  SKY: {
    size: 512,
    url_px: './resources/sky/px.png',
    url_nx: './resources/sky/nx.png',
    url_py: './resources/sky/py.png',
    url_ny: './resources/sky/ny.png',
    url_pz: './resources/sky/pz.png',
    url_nz: './resources/sky/nz.png',
  },
  METAL: {
    size: 128,
    url_px: './resources/metal/px.png',
    url_nx: './resources/metal/nx.png',
    url_py: './resources/metal/py.png',
    url_ny: './resources/metal/ny.png',
    url_pz: './resources/metal/pz.png',
    url_nz: './resources/metal/nz.png',
  }
};

