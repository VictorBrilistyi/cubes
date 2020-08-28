"use strict";

const { Vector2, Raycaster, PerspectiveCamera, WebGLRenderer, Scene, DirectionalLight, BoxBufferGeometry, MeshPhongMaterial, Mesh, MathUtils } = require("three");
const OrbitControls = require("./node_modules/three-orbitcontrols/OrbitControls");

const RED    = 0xFF0000;
const GREEN  = 0x00FF00;
const BLUE   = 0x0000FF;
const CAYEN  = 0x33FFFF;
const WHITE  = 0xFFFFFF;
const BLACK  = 0x000000;
const PINK   = 0xFF69B4;
const KHAKI  = 0xF0E68C;
const YELLOW = 0xFFFF00;

const F = false;
const T = true;



function main (){

    let container, canvas;
    let controls;
    let width, height;
    let camera, scene, renderer;

    let raycaster = new Raycaster();
    let mouse = new Vector2(), INTERSECTED;

    let radius = 100;
    let alpha = 0;



    init();
    animate();

        function init (){

            canvas = document.querySelector('#c');
            container = document.querySelector( '#scene-container' );

            height = canvas.clientHeight;
            width  = canvas.clientWidth;
            
            renderer = new WebGLRenderer({canvas});
            renderer.setClearColor (getRandomColor());
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            scene = new Scene ();

            camera = new PerspectiveCamera (70,width/height,1,10000);
            //camera.position.set(1000,-100,-1000);

            //controls = new OrbitControls ( camera, container);
            //controls.addEventListener('change',renderer);

            let light = new DirectionalLight(WHITE,1);
            light.position.set(1,1,1).normalize();
            scene.add(light);

            let cubes = makeRandNumCubes(2000);

            document.addEventListener( 'mousemove', onMouseMove, false );
        }


        function animate (){

            window.requestAnimationFrame(animate);

            render ();

        }
        function render (){

            if (resizeRendererToDisplaySize(renderer)){
    
                let canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth/canvas.clientHeight;
                camera.updateProjectionMatrix();
               }

               alpha += 0.1;


            camera.position.x = radius * Math.cos(MathUtils.degToRad (alpha));
            camera.position.y = radius * Math.sin(MathUtils.degToRad (alpha));
            camera.position.z = radius * Math.sin(MathUtils.degToRad (alpha));
            camera.lookAt( scene.position );
        
            // update the picking ray with the camera and mouse position
            // обновляем луч выборки с позиций камеры и курсора мышки
            raycaster.setFromCamera( mouse, camera );

            // calculate objects intersecting the picking ray
            // вычисляем объекты, пересекающие луч выборки
            let intersects = raycaster.intersectObjects( scene.children );
// !!!!!
            if ( intersects.length > 0 ) {

                if ( INTERSECTED != intersects[ 0 ].object ) {

                    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                    INTERSECTED = intersects[ 0 ].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex( 0xff0000 );

                }

            } else {

                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

            }
 // !!           
            renderer.render(scene, camera);
        }

        function getRandomValue(max) {
            return Math.floor(Math.random() * Math.floor(max));
          }        

        function getRandomColor() {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }

          function makeRandNumCubes (highLimCubes=0){

            let massiveCubes =[];

            switch (highLimCubes){

                case 0:
                    alert ('Err _highLimCubes_ !');
                break;

                case 1:
                    massiveCubes[0]= makeCubeMesh();
                break;

                default:
                    let randNum = getRandomValue(highLimCubes);
                    for (let i=0;i<=randNum;i++){
                        massiveCubes[i]= makeCubeMesh();
                    }
                break;
            }
            return massiveCubes;
        }          

          function makeCubeMesh (){

            let boxWidth  = 5;
            let boxHeight = 5;
            let boxDepth  = 5;
    
            let geometry = new BoxBufferGeometry(boxWidth, boxHeight, boxDepth);
            let material = new MeshPhongMaterial({color: getRandomColor(), wireframe: F});  
    
            let cube = new Mesh(geometry, material);

            createMeshRandPos(cube,200,200,200);
            createMeshRandRot(cube,40,20,60);

            /* ??
				object.scale.x = Math.random() + 0.5;
				object.scale.y = Math.random() + 0.5;
				object.scale.z = Math.random() + 0.5;
            */
    
            scene.add(cube);
    
            return cube;
    
        }

        function createMeshRandPos(mesh,xLim,yLim,zLim){
            mesh.position.x=getRandomValue(xLim);
            mesh.position.y=getRandomValue(yLim);
            mesh.position.z=getRandomValue(zLim);
        }

        function createMeshRandRot(mesh,xLim,yLim,zLim){
            mesh.rotation.x=getRandomValue(xLim);
            mesh.rotation.y=getRandomValue(yLim);
            mesh.rotation.z=getRandomValue(zLim);
        }

        function resizeRendererToDisplaySize(renderer){
            let canvas = renderer.domElement;
            let width  = canvas.clientWidth;
            let height = canvas.clientHeight;
            let needResize = canvas.width != width || canvas.height != height;
            if (needResize){
                renderer.setSize(width,height,F);
            }
            return needResize;
        
        }

        function onMouseMove( event ) {

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
            // вычисляем положение курсора мышки в нормализованной
            // системе координат (от -1 до +1) для обоих компонентов
            event.preventDefault();

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
          
          }
    }

main ();