const fs = require('fs');

csvFileContent = fs.readFileSync('./f3.csv', { encoding: 'utf8', flag: 'r' });


let lines = csvFileContent.split('\n');
let line = lines[0];
// console.log(line);

let keys = [];

for (let t of line.split(',')) {
    t = t.replace(/\s+/g, '');
    keys.push(t);
}

console.log(JSON.stringify(keys));

let points = [];

for (let i = 1; i < lines.length; ++i) {
    let tokens = lines[i].split(',');
    let v = {};
    for (let ti = 0; ti < tokens.length; ++ti) {
        v[keys[ti]] = +(tokens[ti].replace(/\s+/g, ''));
    }

    // console.log(JSON.stringify(v));

    if (v['SV_POSITION.x'])
        points.push(v);
}

let objFileA = ['mtllib master.mtl', 'usemtl Textured'];

// export the geometry verts
for (let p of points) {
    let x = p['SV_POSITION.x'];
    let y = p['SV_POSITION.y'];
    let z = p['SV_POSITION.z'];

    // fix distortion 
    y = .6 * y;
    z = -1 * z;

    // rotate along z
    let a = -0.08 * Math.PI;
    let ty = y * Math.cos(a) - z * Math.sin(a);
    let tz = y * Math.sin(a) + z * Math.cos(a);

    y = ty;
    z = tz;

    // make the car a bit wider
    z *= 1.1


    objFileA.push(`v ${x} ${y} ${z}`);
}

// export the uv coords
for (let p of points) {
    objFileA.push(`vt ${p['TEXCOORD0.x']} ${1 - p['TEXCOORD0.y']}`);
}

// export the faces
for (let i = 0; i < points.length / 3; ++i) {
    objFileA.push(`f ${i * 3 + 1}/${i * 3 + 1} ${i * 3 + 2}/${i * 3 + 2} ${i * 3 + 3}/${i * 3 + 3}`);
}


// console.log(JSON.stringify(objFileA));

fs.writeFileSync('out.obj', objFileA.join('\n'));
