(() => {
  const canvas = document.querySelector('#lab-pig-3d');
  const image = document.querySelector('#lab-pig');
  const T = window.THREE;
  if (!canvas || !image || !T) return;

  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    return;
  }

  const world = canvas.parentElement;
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-3, 3, 1.6, -1.6, .1, 40);
  camera.position.set(0, 2.9, 8);
  camera.lookAt(0, 1.45, 0);
  const pig = new T.Group();
  scene.add(pig);
  // Use the original stage artwork on a shallow curved surface.
  const surface = new T.PlaneGeometry(2.9, 1.93, 32, 24);
  const vertices = surface.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i) / 1.45;
    const y = vertices.getY(i) / .965;
    vertices.setZ(i, .24 * Math.max(0, 1 - x*x - y*y));
  }
  surface.computeVertexNormals();
  const artwork = new T.Mesh(surface, new T.MeshBasicMaterial({
    transparent: true, alphaTest: .025, side: T.DoubleSide
  }));
  artwork.position.y = .99;
  pig.add(artwork);
  const textures = new Map();
  const textureLoader = new T.TextureLoader();
  let currentSource = '';
  let artworkReady = false;
  function updateArtwork() {
    const source = image.getAttribute('src');
    if (!source || source === currentSource) return;
    currentSource = source;
    artworkReady = false;
    world.classList.remove('lab-3d-ready');
    function show(texture) {
      if (lost || currentSource !== source) return;
      artwork.material.map = texture;
      artwork.material.needsUpdate = true;
      artwork.scale.x = texture.image.width / texture.image.height / (2.9 / 1.93);
      artworkReady = true;
      refresh();
    }
    if (textures.has(source)) {
      show(textures.get(source));
      return;
    }
    textureLoader.load(source, texture => {
      texture.colorSpace = T.SRGBColorSpace;
      textures.set(source, texture);
      show(texture);
    });
  }

  const shadow = new T.Mesh(new T.CircleGeometry(1, 32),
    new T.MeshBasicMaterial({ color: 0x38281e, transparent: true, opacity: .23, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, lost = false, frame = 0;
  function draw(time) {
    const t = motion.matches ? 0 : time / 1000;
    const size = Number(image.style.getPropertyValue('--pig-size')) || .48;
    const phase = t * .45;
    const turn = Math.sin(phase);
    const distance = Math.max(0, Math.min(1.17, camera.right - 1.65));
    pig.position.x = motion.matches ? 0 : distance * Math.cos(phase);
    pig.position.y = Math.abs(Math.sin(t * 7)) * .04 * Math.abs(turn);
    pig.rotation.y = motion.matches ? .16 : (1 - Math.tanh(4 * turn)) * Math.PI / 2 + .18;
    pig.rotation.z = Math.sin(t * 7) * .026 * Math.abs(turn);
    pig.scale.setScalar(size);
    shadow.position.x = pig.position.x;
    shadow.scale.set(1.23 * size, .54 * size, 1);
    renderer.render(scene, camera);
  }
  function tick(time) {
    frame = 0;
    if (lost || !artworkReady || !visible || motion.matches) return;
    draw(time);
    frame = requestAnimationFrame(tick);
  }
  function refresh() {
    if (lost || !artworkReady || !world.clientWidth || !world.clientHeight) return;
    const aspect = world.clientWidth / world.clientHeight;
    const halfWidth = Math.max(2, 1.6 * aspect);
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfWidth / aspect;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(world.clientWidth, world.clientHeight, false);
    draw(performance.now());
    world.classList.add('lab-3d-ready');
    if (!frame && visible && !motion.matches) frame = requestAnimationFrame(tick);
  }
  canvas.addEventListener('webglcontextlost', () => {
    lost = true;
    world.classList.remove('lab-3d-ready');
  });
  new ResizeObserver(refresh).observe(world);
  new MutationObserver(() => { updateArtwork(); if (artworkReady && !lost && motion.matches) draw(0); })
    .observe(image, { attributes: true, attributeFilter: ['style', 'src'] });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame && !lost && !motion.matches) frame = requestAnimationFrame(tick);
  }).observe(world);
  motion.addEventListener('change', refresh);
  updateArtwork();
})();
