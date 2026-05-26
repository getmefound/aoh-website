"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type CancerMapItem = {
  id: string;
  label: string;
  year: string;
  location: string;
  color: string;
  note: string;
  markers: Array<{ label: string; position: [number, number, number] }>;
};

const CANCER_HISTORY: CancerMapItem[] = [
  {
    id: "dlbcl-2019",
    label: "DLBCL",
    year: "2019",
    location: "Spleen / systemic lymphoma history",
    color: "#e11d48",
    note: "Treated with splenectomy and four rounds of R-CHOP, reported successful.",
    markers: [
      { label: "Spleen area", position: [-0.42, 0.72, 0.26] },
      { label: "Lymph system", position: [0, 1.56, 0.2] },
    ],
  },
  {
    id: "malt-2023",
    label: "MALT lymphoma",
    year: "2023",
    location: "Stomach",
    color: "#f59e0b",
    note: "Gastric MALT lymphoma treated with 19 days of targeted radiation, reported successful.",
    markers: [{ label: "Stomach", position: [0.22, 0.58, 0.36] }],
  },
  {
    id: "pet-2026",
    label: "Current PET concern",
    year: "2026",
    location: "FDG-avid thoracic and abdominopelvic nodes",
    color: "#2563eb",
    note: "PET findings show FDG-avid adenopathy. Biopsy is still the key proof point before calling recurrence.",
    markers: [
      { label: "Thoracic nodes", position: [0.1, 1.18, 0.42] },
      { label: "Paraspinal node", position: [-0.35, 0.96, -0.38] },
      { label: "Retrocrural node", position: [-0.25, 0.35, 0.34] },
      { label: "Aortocaval node", position: [0.18, 0.22, 0.32] },
    ],
  },
];

export function CbcBodyMap() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const previousXRef = useRef(0);
  const rotationRef = useRef(0.25);
  const [selectedId, setSelectedId] = useState(CANCER_HISTORY[2].id);
  const selected = CANCER_HISTORY.find((item) => item.id === selectedId) ?? CANCER_HISTORY[0];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ecfeff");

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.15, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const sceneLight = new THREE.HemisphereLight("#ffffff", "#bae6fd", 2.5);
    scene.add(sceneLight);
    const keyLight = new THREE.DirectionalLight("#fff7ed", 3);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const body = new THREE.Group();
    body.rotation.y = rotationRef.current;
    scene.add(body);
    buildBody(body);
    buildCancerMarkers(body, selected);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.9, 80),
      new THREE.MeshBasicMaterial({ color: "#dbeafe", transparent: true, opacity: 0.55 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.55;
    scene.add(floor);

    function resize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }

    function onPointerDown(event: PointerEvent) {
      draggingRef.current = true;
      previousXRef.current = event.clientX;
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (!draggingRef.current) return;
      const delta = event.clientX - previousXRef.current;
      previousXRef.current = event.clientX;
      rotationRef.current += delta * 0.012;
      body.rotation.y = rotationRef.current;
    }

    function onPointerUp(event: PointerEvent) {
      draggingRef.current = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", resize);

    let frameId = 0;
    function animate() {
      frameId = window.requestAnimationFrame(animate);
      if (!draggingRef.current) {
        rotationRef.current += 0.0025;
        body.rotation.y = rotationRef.current;
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [selected]);

  return (
    <section className="cbc-glass overflow-hidden rounded-3xl border shadow-2xl shadow-cyan-100/60 backdrop-blur">
      <div className="grid gap-0 xl:grid-cols-3">
        <div className="cbc-map-stage relative xl:col-span-2">
          <div ref={mountRef} className="cbc-map-canvas cursor-grab touch-none active:cursor-grabbing" />
          <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-white bg-white px-4 py-3 shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-900">Drag to rotate</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">360-degree body map</p>
          </div>
        </div>

        <aside className="border-t border-cyan-100 bg-gradient-to-br from-blue-50 via-cyan-50 to-rose-50 p-6 xl:border-l xl:border-t-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Cancer location view</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Where it has shown up</h2>
          <label className="mt-5 block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Choose cancer history</span>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600"
            >
              {CANCER_HISTORY.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.year} - {item.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: selected.color }} />
              <div>
                <p className="text-sm font-black text-slate-950">{selected.label}</p>
                <p className="text-xs font-bold text-slate-500">{selected.year}</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-800">{selected.location}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{selected.note}</p>
          </div>

          <div className="mt-4 space-y-2">
            {selected.markers.map((marker) => (
              <div key={marker.label} className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/75 p-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selected.color }} />
                <span className="text-sm font-bold text-slate-800">{marker.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            This is a visual map for discussion, not a diagnostic image. The doctor, biopsy, pathology, and scan reports are still the source of truth.
          </div>
        </aside>
      </div>
    </section>
  );
}

function buildBody(group: THREE.Group) {
  const skin = new THREE.MeshStandardMaterial({
    color: "#f6c7a5",
    roughness: 0.62,
    metalness: 0.02,
    transparent: true,
    opacity: 0.82,
  });
  const core = new THREE.MeshStandardMaterial({
    color: "#60a5fa",
    roughness: 0.7,
    transparent: true,
    opacity: 0.14,
  });

  addSphere(group, [0, 1.95, 0], [0.28, 0.34, 0.26], skin);
  addSphere(group, [0, 1.42, 0], [0.62, 0.78, 0.3], skin);
  addSphere(group, [0, 0.58, 0], [0.48, 0.58, 0.28], skin);
  addSphere(group, [0, 1.03, 0.04], [0.46, 0.72, 0.18], core);

  addLimb(group, [-0.5, 1.42, 0], [-0.92, 0.62, 0.05], 0.1, skin);
  addLimb(group, [0.5, 1.42, 0], [0.92, 0.62, 0.05], 0.1, skin);
  addLimb(group, [-0.24, 0.12, 0], [-0.36, -1.32, 0.04], 0.12, skin);
  addLimb(group, [0.24, 0.12, 0], [0.36, -1.32, 0.04], 0.12, skin);

  const spine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 2.35, 24),
    new THREE.MeshStandardMaterial({ color: "#2563eb", transparent: true, opacity: 0.45 }),
  );
  spine.position.set(0, 0.7, -0.22);
  group.add(spine);
}

function buildCancerMarkers(group: THREE.Group, item: CancerMapItem) {
  const markerMaterial = new THREE.MeshStandardMaterial({
    color: item.color,
    emissive: item.color,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });
  const ringMaterial = new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.28, side: THREE.DoubleSide });

  item.markers.forEach((marker, index) => {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(index === 0 ? 0.095 : 0.075, 32, 32), markerMaterial);
    sphere.position.set(...marker.position);
    group.add(sphere);

    const ring = new THREE.Mesh(new THREE.RingGeometry(0.13, 0.17, 48), ringMaterial);
    ring.position.set(marker.position[0], marker.position[1], marker.position[2] + 0.01);
    ring.lookAt(0, marker.position[1], 4);
    group.add(ring);
  });
}

function addSphere(group: THREE.Group, position: [number, number, number], scale: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  group.add(mesh);
}

function addLimb(group: THREE.Group, start: [number, number, number], end: [number, number, number], radius: number, material: THREE.Material) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.75, length, 28), material);
  mesh.position.copy(startVector.clone().add(endVector).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  group.add(mesh);
}
