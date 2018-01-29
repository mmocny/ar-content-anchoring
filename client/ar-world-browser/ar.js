/*
 * Code borrowed liberally from https://github.com/google-ar/three.ar.js/blob/master/examples/spawn-at-camera.html
 * */

/******************************************************************************/

(function () {

/******************************************************************************/

let vrDisplay;
let vrFrameData;
let vrControls;
let arView;
let canvas;
let camera;
let scene;
let cssScene;
let renderer;
let cssRenderer;
let colors = [
  new THREE.Color( 0xffffff ),
  new THREE.Color( 0xffff00 ),
  new THREE.Color( 0xff00ff ),
  new THREE.Color( 0xff0000 ),
  new THREE.Color( 0x00ffff ),
  new THREE.Color( 0x00ff00 ),
  new THREE.Color( 0x0000ff ),
  new THREE.Color( 0x000000 )
];

/******************************************************************************/

/**
 * Use the `getARDisplay()` utility to leverage the WebVR API
 * to see if there are any AR-capable WebVR VRDisplays. Returns
 * a valid display if found. Otherwise, display the unsupported
 * browser message.
 */
THREE.ARUtils.getARDisplay().then(function (display) {
  if (display) {
    vrFrameData = new VRFrameData();
    vrDisplay = display;
    init();
  } else {
    THREE.ARUtils.displayUnsupportedMessage();
  }
});

function init() {
  // Turn on the debugging panel
  let arDebug = new THREE.ARDebug(vrDisplay);
  document.body.appendChild(arDebug.getElement());

  // Setup the three.js rendering environment
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  cssRenderer = new THREE.CSS3DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);

  // TODO: needed?
  //cssRenderer.domElement.style.position = 'absolute';
  //glRenderer.domElement.style.zIndex = 0;
  //cssRenderer.domElement.style.top = 0;

  canvas = renderer.domElement;

  document.body.appendChild(cssRenderer.domElement);
  cssRenderer.domElement.appendChild(canvas);

  scene = new THREE.Scene();
  cssScene = new THREE.Scene();
  // Creating the ARView, which is the object that handles
  // the rendering of the camera stream behind the three.js
  // scene
  arView = new THREE.ARView(vrDisplay, renderer);
  // The ARPerspectiveCamera is very similar to THREE.PerspectiveCamera,
  // except when using an AR-capable browser, the camera uses
  // the projection matrix provided from the device, so that the
  // perspective camera's depth planes and field of view matches
  // the physical camera on the device.
  camera = new THREE.ARPerspectiveCamera(
    vrDisplay,
    60,
    window.innerWidth / window.innerHeight,
    vrDisplay.depthNear,
    vrDisplay.depthFar
  );
  // VRControls is a utility from three.js that applies the device's
  // orientation/position to the perspective camera, keeping our
  // real world and virtual world in sync.
  vrControls = new THREE.VRControls(camera);

  // Bind our event handlers
  window.addEventListener('resize', onWindowResize, false);
  canvas.addEventListener('touchstart', onClick, false);

  // Kick off the render loop!
  update();
}

/**
 * The render loop, called once per frame. Handles updating
 * our scene and rendering.
 */
function update() {
  // Clears color from the frame before rendering the camera (arView) or scene.
  renderer.clearColor();
  renderer.clearDepth();

  // Render the device's camera stream on screen first of all.
  // It allows to get the right pose synchronized with the right frame.
  arView.render();
  // Update our camera projection matrix in the event that
  // the near or far planes have updated
  camera.updateProjectionMatrix();
  // From the WebVR API, populate `vrFrameData` with
  // updated information for the frame
  vrDisplay.getFrameData(vrFrameData);
  // Update our perspective camera's positioning
  vrControls.update();

  // Render our three.js virtual scene
  renderer.render(scene, camera);
  cssRenderer.render(cssScene, camera);

  // Kick off the requestAnimationFrame to call this function
  // when a new VRDisplay frame is rendered
  vrDisplay.requestAnimationFrame(update);
}

/**
 * On window resize, update the perspective camera's aspect ratio,
 * and call `updateProjectionMatrix` so that we can get the latest
 * projection matrix provided from the device
 */
function onWindowResize () {
  console.log('setRenderer size', window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick () {
  // Fetch the pose data from the current frame
  let pose = vrFrameData.pose;
  // Convert the pose orientation and position into
  // THREE.Quaternion and THREE.Vector3 respectively
  let ori = new THREE.Quaternion(
    pose.orientation[0],
    pose.orientation[1],
    pose.orientation[2],
    pose.orientation[3]
  );
  let pos = new THREE.Vector3(
    pose.position[0],
    pose.position[1],
    pose.position[2]
  );

  let dirMtx = new THREE.Matrix4();
  dirMtx.makeRotationFromQuaternion(ori);

  let push = new THREE.Vector3(0, 0, -3.0);
  push.transformDirection(dirMtx);
  pos.addScaledVector(push, 0.125);

  /**/

  // From: http://adndevblog.typepad.com/cloud_and_mobile/2015/07/embedding-webpages-in-a-3d-threejs-scene.html
  create3dPage(0.5, 0.5, pos, ori,
               'http://cascalrestaurant.com/site2011/images/homepage_center_content.jpg');
}


///////////////////////////////////////////////////////////////////
// Creates plane mesh
//
///////////////////////////////////////////////////////////////////
function createPlane(w, h, position, rotation) {
  let material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.0,
    side: THREE.DoubleSide
  });
  let geometry = new THREE.PlaneGeometry(w, h);
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = position.x;
  mesh.position.y = position.y;
  mesh.position.z = position.z;
  mesh.rotation.x = rotation.x;
  mesh.rotation.y = rotation.y;
  mesh.rotation.z = rotation.z;
  return mesh;
}
///////////////////////////////////////////////////////////////////
// Creates CSS object
//
///////////////////////////////////////////////////////////////////
function createCssObject(w, h, position, rotation, url) {
  let html = [
      '<div style="width:' + w + 'px; height:' + h + 'px;">',
      '<iframe src="' + url + '" width="' + w + '" height="' + h + '">',
      '</iframe>',
      '</div>'
    ].join('\n');

  let div = document.createElement('div');
  div.innerHTML = html;

  let cssObject = new THREE.CSS3DObject(div);
  cssObject.position.x = position.x;
  cssObject.position.y = position.y;
  cssObject.position.z = position.z;
  cssObject.rotation.x = rotation.x;
  cssObject.rotation.y = rotation.y;
  cssObject.rotation.z = rotation.z;
  return cssObject;
}

///////////////////////////////////////////////////////////////////
// Creates 3d webpage object
//
///////////////////////////////////////////////////////////////////
function create3dPage(w, h, position, rotation, url) {
  let plane = createPlane(
      w, h,
      position,
      rotation);
  scene.add(plane);
  let cssObject = createCssObject(
      w, h,
      position,
      rotation,
      url);
  cssScene.add(cssObject);
}

/******************************************************************************/

}());
