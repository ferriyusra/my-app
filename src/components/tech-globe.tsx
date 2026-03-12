'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface GlobeSkill {
  name: string;
  icon: string;
  color: string;
  category: string;
}

interface Props {
  skills: GlobeSkill[];
  activeCategory: string;
}

// Evenly distribute n points on a sphere (Fibonacci lattice)
function fibonacciSphere(n: number): THREE.Vector3[] {
  const golden = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi   = (2 * Math.PI * i) / golden;
    return new THREE.Vector3(
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi),
    );
  });
}

export default function TechGlobe({ skills, activeCategory }: Props) {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const labelsRef    = useRef<HTMLDivElement>(null);
  const stateRef     = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene:    null as THREE.Scene | null,
    camera:   null as THREE.PerspectiveCamera | null,
    globe:    null as THREE.Group | null,
    raf:      0,
    drag:     false,
    autoSpin: true,
    prev:     { x: 0, y: 0 },
    nodes:    [] as { el: HTMLDivElement; pos: THREE.Vector3; name: string }[],
  });

  /* ─── build / rebuild scene ─────────────────────────── */
  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    const labDiv = labelsRef.current;
    if (!wrap || !canvas || !labDiv) return;

    const s = stateRef.current;

    // ── renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    s.renderer = renderer;

    // ── scene & camera ────────────────────────────────────
    const scene  = new THREE.Scene();
    s.scene      = scene;
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 3.6;
    s.camera     = camera;

    // ── globe group ───────────────────────────────────────
    const globe = new THREE.Group();
    s.globe     = globe;
    scene.add(globe);

    // Core sphere — light gray
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color:       0xf0f0f0,
        emissive:    0xe8e8f0,
        shininess:   18,
        transparent: true,
        opacity:     0.95,
      }),
    );
    globe.add(sphere);

    // Latitude / longitude lines — light wireframe
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 28, 20),
      new THREE.MeshBasicMaterial({
        color:       0xe5e5e5,
        wireframe:   true,
        transparent: true,
        opacity:     0.5,
      }),
    );
    globe.add(wire);

    // Atmospheric glow (outer ring) — subtle light blue tint
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 32, 32),
      new THREE.MeshBasicMaterial({
        color:       0xc7d2fe,
        transparent: true,
        opacity:     0.06,
        side:        THREE.BackSide,
      }),
    );
    scene.add(atmo);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(3, 4, 3);
    scene.add(key);
    const fill = new THREE.PointLight(0x6366f1, 0.4, 12);
    fill.position.set(-3, -2, 2);
    scene.add(fill);

    // ── skill nodes ───────────────────────────────────────
    const positions = fibonacciSphere(skills.length);
    labDiv.innerHTML = '';
    s.nodes = [];

    skills.forEach((skill, i) => {
      const pos = positions[i];

      // Dot mesh
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 8, 8),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(skill.color) }),
      );
      dot.position.copy(pos);
      globe.add(dot);

      // Glow halo around dot
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 8, 8),
        new THREE.MeshBasicMaterial({
          color:       new THREE.Color(skill.color),
          transparent: true,
          opacity:     0.18,
        }),
      );
      halo.position.copy(pos);
      globe.add(halo);

      // HTML label
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        display:inline-flex;align-items:center;gap:5px;
        padding:4px 9px;
        background:rgba(255,255,255,0.9);
        border:1px solid #e5e5e5;
        border-radius:7px;
        font-size:11px;font-weight:600;
        color:#0a0a0a;
        font-family:'Inter',sans-serif;
        white-space:nowrap;
        transform:translate(-50%,-50%);
        pointer-events:none;
        transition:opacity 0.18s,transform 0.18s;
        backdrop-filter:blur(4px);
        box-shadow:0 1px 3px rgba(0,0,0,0.08);
      `;
      el.innerHTML = `<img src="${skill.icon}" width="13" height="13" alt="" />${skill.name}`;
      labDiv.appendChild(el);
      s.nodes.push({ el, pos, name: skill.name });
    });

    // ── resize helper ────────────────────────────────────
    function resize() {
      if (!wrap || !s.renderer || !s.camera) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      s.camera.aspect = w / h;
      s.camera.updateProjectionMatrix();
      s.renderer.setSize(w, h);
    }
    resize();

    // ── animation loop ────────────────────────────────────
    function animate() {
      s.raf = requestAnimationFrame(animate);
      if (!s.renderer || !s.scene || !s.camera || !s.globe) return;

      if (s.autoSpin && !s.drag) s.globe.rotation.y += 0.0028;

      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;

      s.nodes.forEach(({ el, pos }) => {
        // Transform local sphere position by globe rotation
        const world = pos.clone().applyEuler(s.globe!.rotation);
        const ndc   = world.clone().project(s.camera!);

        const sx = (ndc.x *  0.5 + 0.5) * w;
        const sy = (ndc.y * -0.5 + 0.5) * h;

        // z > 0 means facing camera
        const visible = world.z > 0.05;
        const depth   = THREE.MathUtils.clamp(world.z, 0, 1);

        el.style.left    = `${sx}px`;
        el.style.top     = `${sy}px`;
        el.style.opacity = visible ? String(depth * 0.95 + 0.05) : '0';
        el.style.zIndex  = visible ? String(Math.floor(depth * 999)) : '-1';
      });

      s.renderer.render(s.scene, s.camera);
    }
    animate();

    // ── mouse / touch drag ────────────────────────────────
    function onDown(e: MouseEvent | TouchEvent) {
      s.drag     = true;
      s.autoSpin = false;
      const pt   = 'touches' in e ? e.touches[0] : e;
      s.prev     = { x: pt.clientX, y: pt.clientY };
    }
    function onMove(e: MouseEvent | TouchEvent) {
      if (!s.drag || !s.globe) return;
      const pt   = 'touches' in e ? e.touches[0] : e;
      const dx   = pt.clientX - s.prev.x;
      const dy   = pt.clientY - s.prev.y;
      s.globe.rotation.y += dx * 0.005;
      s.globe.rotation.x += dy * 0.005;
      s.prev = { x: pt.clientX, y: pt.clientY };
    }
    function onUp() {
      s.drag = false;
      setTimeout(() => { s.autoSpin = true; }, 1800);
    }

    canvas.addEventListener('mousedown',  onDown as EventListener);
    canvas.addEventListener('touchstart', onDown as EventListener, { passive: true });
    window.addEventListener('mousemove',  onMove as EventListener);
    window.addEventListener('touchmove',  onMove as EventListener, { passive: true });
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchend',   onUp);
    window.addEventListener('resize',     resize);

    return () => {
      cancelAnimationFrame(s.raf);
      canvas.removeEventListener('mousedown',  onDown as EventListener);
      canvas.removeEventListener('touchstart', onDown as EventListener);
      window.removeEventListener('mousemove',  onMove as EventListener);
      window.removeEventListener('touchmove',  onMove as EventListener);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchend',   onUp);
      window.removeEventListener('resize',     resize);
      s.renderer?.dispose();
      labDiv.innerHTML = '';
      s.nodes = [];
    };
  }, [skills]);

  /* ─── dim labels not in the active category ─────────── */
  useEffect(() => {
    stateRef.current.nodes.forEach(({ el, name }) => {
      const skill = skills.find(s => s.name === name);
      if (!skill) return;
      const match = activeCategory === 'All' || skill.category === activeCategory;
      el.style.filter  = match ? 'none'               : 'brightness(1.05) saturate(0.2) opacity(0.35)';
      el.style.borderColor = match ? '#e5e5e5' : '#f0f0f0';
    });
  }, [activeCategory, skills]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(380px, 55vw, 580px)',
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div ref={labelsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }} />
    </div>
  );
}
