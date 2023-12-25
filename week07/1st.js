import * as THREE from '../three/three.module.js';

// Our Javascript will go here.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 3000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xCBEFFF,1);
renderer.setPixelRatio(window.devicePixelRatio);


var lightOne=new THREE.AmbientLight(0xffff, 0.5); 
scene.add(lightOne);

var lightTwo=new THREE.PointLight(0xffff, 0.5);
scene.add(lightTwo);


document.body.appendChild( renderer.domElement );

var delta=0;



var pyramidgeometry=new THREE.CylinderGeometry(0, 0.8, 2, 4);
var pyramidmaterial=new THREE.MeshLambertMaterial({color: 0xF3FFE2});
var pyramidmesh=new THREE.Mesh(pyramidgeometry, pyramidmaterial);
pyramidmesh.position.set(0, 2, -10);
scene.add(pyramidmesh);



var boxgeometry=new THREE.BoxGeometry(1, 1, 1);
var boxmaterial=new THREE.MeshNormalMaterial({color: 0xFF0000, transparent: true, opacity: 1});
var boxmesh=new THREE.Mesh(boxgeometry, boxmaterial);
boxmesh.position.set(-0.9, 0, -6);
scene.add(boxmesh);


var spheregeometry=new THREE.SphereGeometry(0.5);
var spherematerial=new THREE.LineBasicMaterial({color: 0x888888});
var spheremesh=new THREE.Line(spheregeometry, spherematerial);
spheremesh.position.set(0.9, 0, -6);
scene.add(spheremesh);


var circlegeometry=new THREE.CircleBufferGeometry(0.5);
var circlematerial=new THREE.MeshStandardMaterial({color: 0x098877, roughness: 90.0, metalness: 0.9});
var circlemesh=new THREE.Mesh(circlegeometry, circlematerial);
circlemesh.position.set(2, 0, -6);
circlemesh.rotation.set(0, 0.5, 0);
scene.add(circlemesh);



var paraFunction=function(a, b)
{
	var x=-5+5*a;
	var y=-5+5*b;
	var z=(Math.sin(a*Math.PI)+Math.sin(b*Math.PI))*(-7);
	return new THREE.Vector3(x, y, z);
}



var parageometry=new THREE.BufferGeometry(paraFunction, 8, 8);
//var parageometry=new THREE.ParametricGeometry(paraFunction, 8, 8);
var paramaterial=new THREE.MeshPhongMaterial({color: 0xF3FFE2});
var paramesh=new THREE.Mesh(parageometry, paramaterial);
paramesh.position.set(0, -2, -100);
scene.add(paramesh);


var planegeometry=new THREE.PlaneGeometry(10, 10);
var planematerial=new THREE.MeshPhongMaterial({color: 0xF3FFE2, specular: 0xFF0000, shininess: 50});
var planemesh=new THREE.Mesh(planegeometry, planematerial);
planemesh.position.set(0, -20, -100);
scene.add(planemesh);



//camera.position.z = 5;

//Створення функції animate
function animate() {
	pyramidmesh.rotation.y+=0.1;
	paramesh.rotation.x+=0.1;
	paramesh.rotation.y+=0.1;
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	delta+=0.1;
	planegeometry.vertices[0].z= - 25 + Math.sin(delta) * 50;
	planegeometry.verticesNeedUpdate=true;
}

//Виклик функції animate
animate();