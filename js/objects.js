
// Camara
let camera = {
    eye: CAMERA.EYE,
    target: CAMERA.TARGET,
    up: CAMERA.UP,
    lateral: CAMERA.LATERAL,
    fov_y: CAMERA.FOV_Y,
    aspect: CAMERA.ASPECT,
    near: CAMERA.NEAR,
    far: CAMERA.FAR,
};


let light = {
    pointPosition: LIGHT.POINT_POSITION,
    attenuation: LIGHT.ATTENUATION, // Contante, lineal y cuadratica
    pointExponent: LIGHT.POINT_EXPONENT,
    pointCutoff: LIGHT.POINT_CUTOFF,
    ambientColor: LIGHT.AMBIENT_COLOR,
    diffuseColor: LIGHT.DIFFUSE_COLOR,
    specularColor: LIGHT.SPECULAR_COLOR,
}


let objects = setupData();


function setupData() {

    let prism;
    let d = [];
    for (const pos of SCENE_SQUARE_POS) {
        prism = generatePrism(PRISM_RADIUS, PRISM_LENGTH, PRISM_N, pos);
        d.push(prism);
    }

    let sphere = generateSphere(SPHERE_RADIUS, SPHERE_LONGITUDE, SPHERE_LATITUDE);
    let sphereSmall = generateSphere(SPHERE_RADIUS_SMALL, SPHERE_LONGITUDE_SMALL, SPHERE_LATITUDE_SMALL);


    console.log("PRISM: ", prism);
    console.log("SPHERE: ", sphere);

    let objs = {
        DIRT: {
            "material": MATERIALS.DIRT,
            "data": d,
            "position": [0, 0, 0],
            "rotate": true,
            "type": "DIRT",
        },
        SPHERE: {
            "material": MATERIALS.METAL,
            "data": [sphereSmall],
            "position": [0, 1.5, 0],
            "rotate":true,
            "type": "METAL",
        },
        SKY: {
            "material": MATERIALS.SKY,
            "data": [sphere],
            "position": [0, 0, 0],
            "rotate":false,
            "type": "SKY",
        }
    };


    return objs;
}