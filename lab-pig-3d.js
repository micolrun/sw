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
  scene.add(new T.HemisphereLight(0xfff1df, 0xb78972, 2));
  const light = new T.DirectionalLight(0xffe2c7, 2.3);
  light.position.set(-3, 5, 4);
  scene.add(light);

  const rim = new T.DirectionalLight(0xffeedb, 1.45);
  rim.position.set(2, 3, -4);
  scene.add(rim);
  const pig = new T.Group();
  scene.add(pig);
  const sphere = new T.SphereGeometry(1, 36, 24);
  const material = color => new T.MeshStandardMaterial({ color, roughness: .75 });
  const skin = material(0xf3aa97);
  const pink = material(0xe68584);
  const hoof = material(0x936052);
  const dark = material(0x422c26);
  const shine = material(0xfffaf1);
  function shape(parent, surface, position, size) {
    const mesh = new T.Mesh(sphere, surface);
    mesh.position.set(...position);
    mesh.scale.set(...size);
    parent.add(mesh);
    return mesh;
  }
  const body = shape(pig, skin, [0, .96, 0], [.94, .59, .51]);
  const shoulders = shape(pig, skin, [-.57,.94,0], [.51,.55,.48]);
  const rump = shape(pig, skin, [.53,.95,0], [.51,.55,.49]);
  const head = new T.Group();
  pig.add(head);
  shape(head, skin, [0, 0, 0], [.56, .54, .48]);
  shape(head, skin, [-.26, -.18, 0], [.40, .32, .40]);
  shape(head, pink, [-.51, -.09, 0], [.22, .22, .32]);
  const blush = material(0xf4a094);
  const iris = material(0x875130);
  const earInside = material(0xe5958e);
  const smileMaterial = material(0xa45c56);
  function tube(parent, points, thickness, surface) {
    const curve = new T.CatmullRomCurve3(points.map(point => new T.Vector3(...point)));
    parent.add(new T.Mesh(new T.TubeGeometry(curve, 16, thickness, 8, false), surface));
  }
  const ears = [];
  for (const side of [-1, 1]) {
    shape(head, dark, [-.707, -.066, .124 * side], [.025, .052, .044]);
    shape(head, blush, [-.21, -.15, .39 * side], [.155, .12, .065]);
    shape(head, shine, [-.245, .105, .423 * side], [.12, .133, .051]);
    shape(head, iris, [-.274, .095, .464 * side], [.081, .099, .036]);
    shape(head, dark, [-.285, .099, .489 * side], [.053, .069, .023]);
    shape(head, shine, [-.302, .128, .507 * side], [.023, .027, .012]);
    tube(head, [[-.36,.268,.399*side],[-.27,.299,.421*side],[-.17,.279,.431*side]], .018, smileMaterial);
    tube(head, [[-.55,-.264,.258*side],[-.41,-.312,.344*side],[-.26,-.268,.414*side]], .016, smileMaterial);

    const ear = new T.Group();
    ear.position.set(.10, .38, .30 * side);
    ear.rotation.x = side * .58;
    head.add(ear);
    ears.push(ear);
    shape(ear, skin, [0,.12,0], [.19,.25,.12]).rotation.z = -.26;
    shape(ear, skin, [.065,.19,.092*side], [.159,.217,.098]).rotation.z = -.88;
    shape(ear, earInside, [.03,.12,.112*side], [.123,.173,.04]).rotation.z = -.48;
  }
  const tail = new T.CatmullRomCurve3([
    [.81, 1.13, 0], [1.08, 1.26, 0], [1.23, 1.46, 0],
    [1.39, 1.36, 0], [1.32, 1.2, 0], [1.21, 1.31, 0]
  ].map(point => new T.Vector3(...point)));
  pig.add(new T.Mesh(new T.TubeGeometry(tail, 22, .046, 8, false), skin));

  const legs = [];
  for (const x of [-.58, .58]) {
    for (const z of [-.34, .34]) {
      const leg = new T.Group();
      leg.position.set(x, .73, z);
      shape(leg, skin, [0, -.29, 0], [.15, .35, .15]);
      shape(leg, hoof, [-.04, -.61, 0], [.18, .114, .15]);
      pig.add(leg);
      legs.push(leg);
    }
  }

  const shadow = new T.Mesh(new T.CircleGeometry(1, 32),
    new T.MeshBasicMaterial({ color: 0x38281e, transparent: true, opacity: .23, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  const proportions = {
    suckling: [.79, 1.1], nursery: [.91, 1.02],
    growing: [1.03, .92], finishing: [1.15, .86]
  };
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, lost = false, frame = 0;
  function draw(time) {
    const t = motion.matches ? 0 : time / 1000;
    const [length, headSize] = proportions[image.dataset.stage] || proportions.suckling;
    const size = Number(image.style.getPropertyValue('--pig-size')) || .48;
    const phase = t * .45;
    const turn = Math.sin(phase);
    const distance = Math.max(0, Math.min(1.17, camera.right - 1.65));
    pig.position.x = motion.matches ? 0 : distance * Math.cos(phase);
    pig.position.y = Math.abs(Math.sin(t * 7)) * .025;
    pig.rotation.y = motion.matches ? .42 : (1 - Math.tanh(4 * turn)) * Math.PI / 2 + .36;
    pig.scale.setScalar(size);
    body.scale.x = .94 * length;
    shoulders.position.x = -.57 * length;
    rump.position.x = .53 * length;
    ears.forEach((ear, i) => { ear.rotation.z = Math.sin(t * 7 + i * .5) * .055; });
    head.position.set(-.79 * length, 1.14, .02);
    head.scale.setScalar(headSize);
    head.rotation.z = Math.sin(t * 7) * .045;
    legs.forEach((leg, i) => {
      leg.position.x = (i < 2 ? -.58 : .58) * length;
      leg.rotation.z = Math.sin(t * 7 + (i === 1 || i === 2 ? Math.PI : 0)) * .24 * Math.abs(turn);
    });
    shadow.position.x = pig.position.x;
    shadow.scale.set(1.23 * size, .54 * size, 1);
    renderer.render(scene, camera);
  }
  function tick(time) {
    frame = 0;
    if (lost || !visible || motion.matches) return;
    draw(time);
    frame = requestAnimationFrame(tick);
  }
  function refresh() {
    if (lost || !world.clientWidth || !world.clientHeight) return;
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
  new MutationObserver(() => { if (!lost && motion.matches) draw(0); })
    .observe(image, { attributes: true, attributeFilter: ['style', 'data-stage'] });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !frame && !lost && !motion.matches) frame = requestAnimationFrame(tick);
  }).observe(world);
  motion.addEventListener('change', refresh);
  refresh();
})();
