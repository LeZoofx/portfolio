// Bake the existing low-poly geometry once, instead of creating a WebGL engine on every visit.
import fs from 'node:fs/promises';
import ts from 'typescript';
import * as THREE from 'three';
await fs.mkdir('tmp',{recursive:true});
let source=await fs.readFile('scripts/scenery-source.tsx','utf8');
const styles=['liquid','baroque','matchbox','pixel','noir','aero','calendar','brutal','anti','curse','sigil','retro'];
source=source.replace("import {artStyles,type ArtStyle} from '../src/artStyles';",'const artStyles='+JSON.stringify(styles)+'; type ArtStyle=string;');
const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2022}}).outputText;
await fs.writeFile('tmp/scenery-bake.mjs',code);
const {Scenery}=await import('../tmp/scenery-bake.mjs?bake='+Date.now());
function add(node,parent){
 if(node==null||typeof node==='boolean')return;
 if(Array.isArray(node)){node.forEach(n=>add(n,parent));return}
 if(typeof node.type==='function'){add(node.type(node.props),parent);return}
 if(typeof node.type==='symbol'){add(node.props.children,parent);return}
 const {children,args=[],position,rotation,...props}=node.props;
 const constructors={group:THREE.Group,mesh:THREE.Mesh,boxGeometry:THREE.BoxGeometry,planeGeometry:THREE.PlaneGeometry,cylinderGeometry:THREE.CylinderGeometry,torusGeometry:THREE.TorusGeometry,icosahedronGeometry:THREE.IcosahedronGeometry,dodecahedronGeometry:THREE.DodecahedronGeometry,coneGeometry:THREE.ConeGeometry};
 if(node.type.includes('Material')){parent.material=new THREE.MeshBasicMaterial({color:props.color||'#ffffff',transparent:props.transparent||false,opacity:props.opacity??1});return}
 const C=constructors[node.type];if(!C)throw Error('Unknown geometry '+node.type);
 const object=new C(...args);
 if(node.type.endsWith('Geometry')){parent.geometry=object;return}
 if(position)object.position.fromArray(position);if(rotation)object.rotation.fromArray(rotation);
 parent.add(object);add(children,object);
}
await fs.mkdir('public/scenery',{recursive:true});
for(const art of styles){
 const scene=new THREE.Scene();add(Scenery({art}),scene);scene.updateMatrixWorld(true);
 const camera=new THREE.PerspectiveCamera(52,16/9,.1,125);camera.position.set(0,4,12);camera.lookAt(.45,1,-18);camera.updateMatrixWorld(true);
 const triangles=[],sun=new THREE.Vector3(-.3,.85,.4).normalize();
 scene.traverse(mesh=>{if(!mesh.isMesh)return;const g=mesh.geometry,index=g.index,pos=g.getAttribute('position'),mat=mesh.material;
  for(let i=0;i<(index?.count||pos.count);i+=3){
   const vertices=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pos,index?index.getX(i+j):i+j).applyMatrix4(mesh.matrixWorld));
   const normal=new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(vertices[1],vertices[0]),new THREE.Vector3().subVectors(vertices[2],vertices[0])).normalize();
   const centre=vertices.reduce((a,v)=>a.add(v),new THREE.Vector3()).multiplyScalar(1/3);
   if(normal.dot(new THREE.Vector3().subVectors(camera.position,centre))<=0)continue;
   const projected=vertices.map(v=>v.clone().project(camera));if(projected.some(v=>v.z>1||v.z< -1))continue;
   const light=.58+Math.max(0,normal.dot(sun))*.45,color=mat.color.clone().multiplyScalar(light).getStyle();
   const points=projected.map(v=>`${((v.x*.5+.5)*1600).toFixed(1)} ${((-v.y*.5+.5)*900).toFixed(1)}`);
   triangles.push({z:centre.distanceToSquared(camera.position),path:`<path d="M${points.join('L')}Z" fill="${color}" fill-opacity="${mat.opacity}" stroke="${color}" stroke-width=".45" stroke-opacity="${mat.opacity}"/>`});
  }
 });
 triangles.sort((a,b)=>b.z-a.z);
 await fs.writeFile(`public/scenery/${art}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">${triangles.map(t=>t.path).join('')}</svg>`);
}
console.log('Baked 12 scenery plates from the existing meshes.');
