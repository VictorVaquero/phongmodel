
/**************** Generación datos prisma *************/
function generatePrism(radius, length, faces, center) {

  let ang = -2 * Math.PI / faces;
  let init_ang = -Math.PI / 4;

  let base = Array(faces).fill().map(
    (v, i) => [radius * Math.sin(-ang * (i + 1) + init_ang),
      -length / 2,
      radius * Math.cos(-ang * (i + 1) + init_ang)
    ]
  ).flat();

  let top = Array(faces).fill().map(
    (v, i) => [
      radius * Math.sin(ang * (i + 1) + init_ang),
      +length / 2,
      radius * Math.cos(ang * (i + 1) + init_ang)
    ]
  ).flat();

  let wall = Array(faces).fill().map(
    function(v, i) {
      let ni = (i + 1) % faces;
      return [
        top[i * 3], +length / 2, top[i * 3 + 2],
        top[i * 3], -length / 2, top[i * 3 + 2],
        top[ni * 3], -length / 2, top[ni * 3 + 2],
        top[i * 3], +length / 2, top[i * 3 + 2],
        top[ni * 3], -length / 2, top[ni * 3 + 2],
        top[ni * 3], +length / 2, top[ni * 3 + 2]
      ];
    }).flat();

  let wallNormals = Array(faces).fill().map(
    function(v, i) {
      let ni = (i + 1) % faces;
      let N = getNormal(
      [top[i * 3], +length / 2, top[i * 3 + 2]],
      [top[i * 3], -length / 2, top[i * 3 + 2]],
      [top[ni * 3], -length / 2, top[ni * 3 + 2]]).map((x)=>-x);

      return [N.flat(),N.flat(),N.flat(),N.flat(),N.flat(),N.flat()];
    }).flat().flat();

  let cent = [0,+length / 2,0];
  let topT = Array(faces).fill().map(
      function(v, i) {
        let ni = (i + 1) % faces;
        return [
          top[i * 3], top[i * 3 +1], top[i * 3 + 2],
          top[ni * 3], top[ni * 3+1], top[ni * 3 + 2],
          ...cent,
        ];
      }).flat();
  let topNormals = Array(faces*3).fill().map(
    (x)=>[0,1,0]
  ).flat();

  cent = [0,-length / 2,0];
  let baseT = Array(faces).fill().map(
      function(v, i) {
        let ni = (i + 1) % faces;
        return [
          base[i * 3], base[i * 3 +1], base[i * 3 + 2],
          base[ni * 3], base[ni * 3+1], base[ni * 3 + 2],
          ...cent,
        ];
      }).flat();
  let baseNormals = Array(faces*3).fill().map(
    (x)=>[0,-1,0]
  ).flat();

  let vertex = wall.slice().concat(topT).concat(baseT);
  let normals = wallNormals.concat(topNormals).concat(baseNormals);
  let texture = vertex.slice();

  vertex = vertex.map((x,i)=>{
    let c = center[i%3];
    return x+c;
  })

  return {
    "vertex":vertex,
    "normal":normals,
    "texture":texture
  }
}

function generateSphere(radius, lon, lat){
  let upHalf = generateHalfSphere(radius,lon,lat,1);
  let downHalf = generateHalfSphere(radius,lon,lat,-1);


  let vertex = upHalf.vertex.concat(downHalf.vertex);
  let normal=upHalf.normal.concat(downHalf.normal);
  let texture=upHalf.vertex.concat(downHalf.vertex).slice();

  texture = Array(texture.length/3).fill().map((x,i)=>{
    let v = texture.slice(i*3,i*3+3);
    return v.map((x)=>x/norm(v));
  }).flat();


  return {
    "vertex":vertex,
    "normal":normal,
    "texture": texture
  }
}

function generateHalfSphere(radius,lon,lat,up){

    let lonAng = up*Math.PI/2 / lon;
    let latAng = up*2*Math.PI / lat;

    let vertex = Array(lon).fill().map((x,i)=>{
      let ni = (i+1);
      let level = Array(lat).fill().map((y,j)=>{
        let nj = (j+1)%lat;
        let r = radius*Math.cos(lonAng*i);
        let nr = radius*Math.cos(lonAng*ni);
        if(ni==lon)
          return [
            Math.cos(latAng*j)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*j)*r,
            Math.cos(latAng*j)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*j)*nr,
            Math.cos(latAng*nj)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*nj)*r];

        return [
          Math.cos(latAng*j)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*j)*r,
          Math.cos(latAng*j)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*j)*nr,
          Math.cos(latAng*nj)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*nj)*r,

          Math.cos(latAng*nj)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*nj)*r,
          Math.cos(latAng*j)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*j)*nr,
          Math.cos(latAng*nj)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*nj)*nr,
        ];
      }).flat();
      return level;
    }).flat();

    let normals = Array(lon).fill().map((x,i)=>{
      let ni = i+1;
      let level = Array(lat).fill().map((y,j)=>{
        let nj = (j+1)%lat;
        let r = radius*Math.cos(lonAng*i);
        let nr = radius*Math.cos(lonAng*ni);

        let N1 = getNormal(
          [Math.cos(latAng*j)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*j)*r],
          [Math.cos(latAng*j)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*j)*nr],
          [Math.cos(latAng*nj)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*nj)*r]);
        let N2 = getNormal(
          [Math.cos(latAng*nj)*r,Math.sin(lonAng*i)*radius, Math.sin(latAng*nj)*r],
          [Math.cos(latAng*j)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*j)*nr],
          [Math.cos(latAng*nj)*nr,Math.sin(lonAng*ni)*radius, Math.sin(latAng*nj)*nr]);

        if(ni==lon) return [...N1,...N1,...N1];
        return [...N1,...N1,...N1,...N2,...N2,...N2];
      }).flat();
      return level;
    }).flat().flat();


    return {
      "vertex":vertex,
      "normal":normals
    }
}
