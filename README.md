# WebGPU Modular Boilerplate – End‑to‑End Production Plan

## 1 Project Vision & Goals

* **Objective:** Deliver a reusable, high‑performance WebGPU boilerplate that any team member (or external user) can fork, drop into, and extend for interactive 3D/compute‑heavy web apps.
* **Core tenets:** *Modularity*, *Performance*, *Developer Experience*, *Visual Fidelity*, *Offline‑first operation*, *Future‑proof WebGPU standards*.
* **Primary outputs:**

  1. **`core/`** package – engine‑agnostic WebGPU context, lifecycle & utilities.
  2. **`modules/`** – drop‑in components (camera, controls, scene, materials, particle‑compute, post‑FX, physics, UI).
  3. **Docs site** – generated technical wiki (Markdown → Docusaurus) & live Storybook playground.
  4. **Starter repo** – Vite + TypeScript + Vitest + ESLint/Prettier; GitHub Actions CI; cloud preview deploy.

## 2 Technology Choice Matrix

| Layer               | Final Choice                                                                                                                                                                                                          | Rationale                                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bundler             | **Vite**                                                                                                                                                                                                              | Fast HMR, native WGSL import plugin & easy multi‑entry builds.                                                                                         |
| Language            | **TypeScript 5.5+**                                                                                                                                                                                                   | Static safety across WebGPU API; ergonomic generics for buffers.                                                                                       |
| 3D Engine           | **Hybrid:** `three@r177` WebGPURenderer *or* core only                                                                                                                                                                | Three for quick scene graph; pure‐core path for minimal builds. ([github.com](https://github.com/mrdoob/three.js/issues/28957?utm_source=chatgpt.com)) |
| Compute / Low‑level | **Raw WebGPU API + WGSL**                                                                                                                                                                                             | Direct control for particles, physics, post‑FX.                                                                                                        |
| UI & Controls       | **React 18 + Zustand state + Leva** GUI                                                                                                                                                                               | Familiar DX; Leva is lightweight, shader‑tweak friendly.                                                                                               |
| Physics             | **Rapier‑wasm** (+ optional GPU compute prototypes)                                                                                                                                                                   | Fast rigid‑body on WASM; fallback to CPU thread.                                                                                                       |
| Post‑FX             | In‑house `postfx` module (fullscreen pass util)                                                                                                                                                                       | Chainable effect composer without engine lock‑in.                                                                                                      |
| Tooling             | ESLint, Prettier, Husky, Commitlint                                                                                                                                                                                   | Enforced style; pre‑commit CI.                                                                                                                         |
| Dev Tools           | Chrome WebGPU DevTools, WebGPU‑Inspector ([github.com](https://github.com/takahirox/webgpu-devtools?utm_source=chatgpt.com), [github.com](https://github.com/brendan-duncan/webgpu_inspector?utm_source=chatgpt.com)) | Frame capture, GPU timings.                                                                                                                            |
| Hosting             | Netlify Edge / Vercel Functions                                                                                                                                                                                       | Fast CDN, SSR optional.                                                                                                                                |

## 3 Repository Structure

```
/boilerplate
│  README.md
│  LICENSE
├─ packages
│   ├─ core                # Low‑level WebGPU context, helpers
│   ├─ modules             # Independent features (each below)
│   │   ├─ camera-orbit
│   │   ├─ lighting-basic
│   │   ├─ material-pbr
│   │   ├─ particles-gpu
│   │   ├─ postfx-bloom
│   │   ├─ physics-rapier
│   │   └─ ui-leva
│   └─ examples            # Vite apps showcasing module combos
├─ docs                    # Docusaurus site
└─ .github/workflows       # CI (lint → test → build → deploy)
```

Each **module** is 100 % self‑contained: `index.ts`, `README`, unit tests, peerDependencies only. Copy/paste ready.

## 4 Architecture Layers

1. **Platform Layer** – WebGPU adapter/device acquisition; feature fallback; swap‑chain config.
2. **Core Runtime** – game‑loop ticker (RAF + fixed timestep), command‑encoder & pass scheduler, resource manager.
3. **Render System** – scene graph interface (<50 loc adaptor when Three.js path enabled).
4. **Compute System** – dispatch orchestration (particles, physics, simulations).
5. **Effect Composer** – post‑process graph built from pass nodes (ping‑pong targets, mip chain helper).
6. **App Layer** – React components wiring modules together; UI & routing.

## 5 Phased Roadmap & Task Breakdown

> *Notation*: **P0** = must‑have for MVP, **P1** = should‑have, **P2** = nice‑to‑have.

### Phase 0 : Research & Design (Week 1‑2)

| #   | Task                                                | Priority |
| --- | --------------------------------------------------- | -------- |
| 0.1 | Audit WebGPU adapters, limits, required features    | P0       |
| 0.2 | Finalize repo structure & coding standards          | P0       |
| 0.3 | Draft API surface (Context, Pass, Module contracts) | P0       |
| 0.4 | Spike Three.js r177 WebGPURenderer integration      | P1       |

### Phase 1 : Core Foundation (Week 3‑4)

\| # | Task | Priority |
\| 1.1 | Implement `WebGPUContext` (device, canvas configure) | P0 |
\| 1.2 | Build RAF/GameLoop & frame graph scheduler | P0 |
\| 1.3 | Add buffer/texture helpers + pipeline cache | P0 |
\| 1.4 | Integrate WebGPU‑Inspector overlay toggle | P1 |

### Phase 2 : Rendering Essentials (Week 5‑6)

\| # | Task | Priority |
\| 2.1 | Orbit camera module (mouse, touch) | P0 |
\| 2.2 | Basic lighting module (dir + point) | P0 |
\| 2.3 | Mesh renderer (unlit & PBR material) | P0 |
\| 2.4 | GLTF asset loader via KTX‑Transcoder | P1 |

### Phase 3 : GPU Particles & Compute (Week 7‑8)

\| # | Task | Priority |
\| 3.1 | Design particle data layout (SSBO) | P0 |
\| 3.2 | Write WGSL compute update shader | P0 |
\| 3.3 | Instanced billboard renderer | P0 |
\| 3.4 | Add curl‑noise & attractor uniforms | P1 |

### Phase 4 : Post‑Processing (Week 9‑10)

\| # | Task | Priority |
\| 4.1 | Create RenderTarget manager | P0 |
\| 4.2 | Implement FXAA & tonemap passes | P0 |
\| 4.3 | Bloom (threshold + Gaussian blur chain) | P1 |
\| 4.4 | Depth‑of‑field & motion‑blur passes | P2 |

### Phase 5 : Physics & Interaction (Week 11‑12)

\| # | Task | Priority |
\| 5.1 | Integrate Rapier WASM, sync transforms | P0 |
\| 5.2 | GPU‑driven soft‑body experiment | P2 |
\| 5.3 | Pointer‑pick utility & raycast | P1 |

### Phase 6 : UX & Tooling (Week 13‑14)

\| # | Task | Priority |
\| 6.1 | Leva GUI bindings per module | P0 |
\| 6.2 | Storybook playground stories | P1 |
\| 6.3 | Pre‑packaged dark/light CSS theme | P2 |

### Phase 7 : Optimization & QA (Week 15‑16)

\| # | Task | Priority |
\| 7.1 | GPU/CPU profiling sessions, fix bottlenecks | P0 |
\| 7.2 | Implement dynamic resolution scaling toggle | P1 |
\| 7.3 | Add automated perf regression test (Playwright) | P2 |

### Phase 8 : Documentation & DX (Week 17‑18)

\| # | Task | Priority |
\| 8.1 | Write module READMEs (API + examples) | P0 |
\| 8.2 | Generate Docusaurus site, deploy to GitHub Pages | P0 |
\| 8.3 | Record short Loom videos for onboarding | P2 |

### Phase 9 : Beta & Feedback (Week 19‑20)

\| # | Task | Priority |
\| 9.1 | Release `v0.9.0‑beta` tag; share with pilot users | P0 |
\| 9.2 | Collect issues & prioritise fixes | P0 |
\| 9.3 | Triage feature requests into v1.x roadmap | P1 |

### Phase 10 : Production Launch (Week 21)

\| # | Task | Priority |
\| 10.1 | Freeze API, bump semver to `1.0.0` | P0 |
\| 10.2 | Publish NPM packages & template repo | P0 |
\| 10.3 | Public announcement blog & social posts | P1 |

## 6 CI/CD Pipeline

1. **Lint & Typecheck** – ESLint + `tsc --noEmit` on every PR.
2. **Unit Tests** – Vitest fast tests; headless WebGPU polyfill for logic parts.
3. **E2E Visual Tests** – Playwright captures screenshot diff on example scenes.
4. **Build & Deploy** – `npm run build` (Vite) → artifact upload → Netlify preview.
5. **Release** – semantic‑release auto‑publishes versioned packages to NPM & pushes changelog.

## 7 Risk & Mitigation

| Risk                       | Mitigation                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Browser WebGPU instability | Keep fallback WebGL path via Three.js renderer flag; automated smoke tests on Canary/Nightly builds. |
| Rapid ecosystem changes    | Lock versions with pnpm lockfile + Renovate bot; monthly dependency review.                          |
| WGSL shader complexity     | Maintain lint rules & shared util library; add WGSL unit tests (Naga parser).                        |

## 8 Key Deliverables & Milestones

| Week | Milestone                                 |
| ---- | ----------------------------------------- |
| 4    | Core foundation branch merged (v0.1)      |
| 8    | GPU particle demo running (v0.3)          |
| 12   | Post‑processing showcase + physics (v0.6) |
| 18   | Full docs site online (v0.8)              |
| 20   | Public beta release (v0.9)                |
| 21   | Stable v1.0 launch                        |

---

### Reference Highlights

* Three.js `WebGPURenderer` discussion & maturity update ([github.com](https://github.com/mrdoob/three.js/issues/28957?utm_source=chatgpt.com))
* Babylon.js WebGPU engine status (v7.0) ([forum.babylonjs.com](https://forum.babylonjs.com/t/current-state-of-webgpu-support-in-babylon-js/57134?utm_source=chatgpt.com))
* Chrome / Edge WebGPU DevTools & WebGPU‑Inspector extensions for debugging ([github.com](https://github.com/takahirox/webgpu-devtools?utm_source=chatgpt.com), [github.com](https://github.com/brendan-duncan/webgpu_inspector?utm_source=chatgpt.com))

---

> **Next Step:** Kick‑off Phase 0 by validating adapter limits & finalising coding guidelines. Assign owners for tasks 0.1–0.4 on Monday stand‑up.

---

## Repository Setup

This repository includes a pnpm workspace with packages for the core WebGPU utilities, optional modules and example apps. Run `pnpm install` and `pnpm -r build` to compile all packages.
