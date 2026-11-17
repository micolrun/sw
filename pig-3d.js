(() => {
  const canvas = document.querySelector('.pig-canvas');
  const stage = document.querySelector('.pig-stage');
  const T = window.THREE;
  if (!canvas || !stage || !T) return;
  try {
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(32, 1, .1, 100);
    camera.position.set(0, 1.5, 9.5);
    camera.lookAt(0, .65, 0);
    scene.add(new T.HemisphereLight(0xfff5e9, 0x536e5b, 2.3));
    const key = new T.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 6, 6); scene.add(key);
    const rim = new T.DirectionalLight(0xffd0c2, 1.7); rim.position.set(4, 3, -3); scene.add(rim);
    const pig = new T.Group(); scene.add(pig);
    const mat = (color, roughness = .6) => new T.MeshStandardMaterial({ color, roughness });
    const skin = mat(0xf8b8ac), inner = mat(0xe98083), hoof = mat(0xb87970), eye = mat(0x322d30,.2), white = mat(0xffffff,.2), snout = mat(0xf18e8f), nostril = mat(0xa9505d), blush = mat(0xf09b9e);
    const ball = (parent, material, x,y,z, sx,sy,sz) => { const m = new T.Mesh(new T.SphereGeometry(1, 32, 24),material); m.position.set(x,y,z); m.scale.set(sx,sy,sz); parent.add(m); return m; };
    ball(pig,skin,0,-.33,0,1.18,.98,.82);
    ball(pig,hoof,-.66,-1.12,.48,.38,.25,.43); ball(pig,hoof,.66,-1.12,.48,.38,.25,.43);
    ball(pig,skin,-1.02,-.38,.08,.3,.5,.34).rotation.z=-.55;
    ball(pig,skin,1.02,-.38,.08,.3,.5,.34).rotation.z=.55;
    const head = new T.Group(); head.position.y=.72; pig.add(head);
    const leftEar=ball(head,skin,-.93,.84,-.05,.39,.67,.25); leftEar.rotation.z=.57;
    const rightEar=ball(head,skin,.93,.84,-.05,.39,.67,.25); rightEar.rotation.z=-.57;
    ball(head,inner,-1,.86,.17,.23,.43,.1).rotation.z=.57; ball(head,inner,1,.86,.17,.23,.43,.1).rotation.z=-.57;
    ball(head,skin,0,0,0,1.35,1.17,.94);
    ball(head,blush,-.85,-.27,.73,.24,.13,.09); ball(head,blush,.85,-.27,.73,.24,.13,.09);
    const eyes = [-.56,.56].map(x => { const e = new T.Group(); e.position.set(x,.13,.83); head.add(e); ball(e,eye,0,0,0,.15,.2,.095); ball(e,white,-.04,.07,.09,.048,.06,.025); return e; });
    ball(head,snout,0,-.35,.92,.58,.39,.3);
    ball(head,nostril,-.21,-.34,1.2,.085,.14,.035); ball(head,nostril,.21,-.34,1.2,.085,.14,.035);
    const smileCurve = new T.QuadraticBezierCurve3(
      new T.Vector3(-.20,-.80,.75),
      new T.Vector3(0,-.92,.72),
      new T.Vector3(.20,-.80,.75)
    );
    head.add(new T.Mesh(new T.TubeGeometry(smileCurve, 24, .022, 8, false), nostril));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => { const w=stage.clientWidth,h=stage.clientHeight; if(!w||!h)return; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.render(scene,camera); };
    let visible = true, frame = 0;
    const draw = ms => { if (!visible || reduced.matches) { frame=0; return; } const t=ms/1000; pig.rotation.y=.16*Math.sin(t*.75); pig.rotation.z=.035*Math.sin(t*1.05); pig.position.y=.06*Math.sin(t*2); head.rotation.z=.035*Math.sin(t*1.1); const blink=Math.max(.08,1-Math.pow(Math.max(0,Math.sin(t*1.3)),40)); eyes.forEach(e=>e.scale.y=blink); renderer.render(scene,camera); frame=requestAnimationFrame(draw); };
    const start = () => { resize(); if(visible && !reduced.matches && !frame) frame=requestAnimationFrame(draw); };
    new ResizeObserver(resize).observe(stage);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible=entries[0].isIntersecting; if(!visible && frame){cancelAnimationFrame(frame);frame=0;} else start(); }).observe(stage);
    reduced.addEventListener('change',()=>{ if(frame){cancelAnimationFrame(frame);frame=0;} eyes.forEach(e=>e.scale.y=1); start(); });
    resize(); stage.classList.add('pig-ready'); start();
  } catch (_) { /* The illustration remains available when WebGL is unavailable. */ }
})();
