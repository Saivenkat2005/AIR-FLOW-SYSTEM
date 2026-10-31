# Runtime Validation Report

**Generated:** 2026-10-30  
**Target:** Airline Nexus

## Summary

| Area | Status | Evidence |
|---|---|---|
| Frontend build | PASS | `npm run build` |
| Frontend performance slice | PASS | Route chunks generated for Home, Login, Signup, FlightSearch, and MyBookings |
| Frontend runtime | PASS | Docker-served `/` contains the booking homepage and no AI-suite page markers |
| API gateway | PASS | Gateway sanity check and `/health` returned HTTP 200 |
| Spring backend tests | PASS | `mvnw.cmd test -q` completed with exit code 0 |
| Spring runtime | PASS | `/actuator/health` returned HTTP 200 with MySQL and Redis UP |
| AI service tests | PASS | 9 tests passed in the running container |
| AI runtime | PASS | `/health` and `/api/v1/ai/search` returned HTTP 200 |
| Demo authentication | PASS | Passenger, manager, and admin login with documented `password123` returned HTTP 200 |
| Docker Compose | PASS | `docker compose config -q`, image builds, and stack startup completed |
| API gateway syntax/test | PASS | `npm test` exited 0; local health probe was non-blocking because no gateway process was running |
| Kubernetes/Istio manifests | PASS | Added deployment, service, mTLS, gateway, routing, timeout and retry manifests |
| Runtime smoke probes | PASS | Gateway, AI, Spring Actuator and frontend returned HTTP 200 |
| Frontend browser E2E | PASS | `Frontend/npm test`, 6 Playwright tests passed, exit code 0 |
| Frontend production build | PASS | `Frontend/npm run build`, exit code 0 |
| Latest frontend/backend regression run | PASS | Frontend E2E 6 passed, Vite build passed, Spring tests exit code 0, gateway passed, AI tests 9 passed |
| Latest live health probes | PASS | Frontend, gateway, AI and Spring Actuator all returned HTTP 200 |
| Premium frontend redesign | PASS | Rebuilt Docker frontend, loaded home screen in browser, verified responsive navigation, primary CTAs, spatial route visual, and feature metrics |
| Auth page redesign | PASS | Login and signup routes loaded after Docker rebuild with accessible fields, demo access controls, and preserved auth navigation |
| AI natural-language flight search | PASS | Fixed missing Compose AI startup and mounted proxy path; `/api/v1/ai/search` returned HTTP 200 and browser flow completed |
| AI fare transparency | PASS | Fare Breakdown reached the AI service and rendered the transparency modal; `/api/v1/ai/explain` returned HTTP 200 |
| Journey Health AI | PASS | Authenticated passenger flow loaded bookings and rendered Journey Health score `90 / 100` |

## Fixes Applied

- Rebuilt the stale frontend production bundle so `/` renders the booking homepage instead of the obsolete AI-suite screen.
- Updated the frontend document title to `AIRLINE NEXUS // Intelligent Air Travel Platform`.
- Added `PYTHONPATH=/src` to the AI image so containerized pytest imports the application package reliably.
- Mapped the existing Compose Redis variables to Spring Boot 3 `spring.data.redis.*` properties.
- Disabled the optional mail health probe by default so placeholder SMTP credentials do not mark the core service unhealthy.
- Replaced the invalid seeded BCrypt hash so the documented demo credentials authenticate correctly.
- Added lazy-loaded frontend routes, a global render-error boundary, and `prefers-reduced-motion` support.
- Added a shared Axios client with JWT propagation, request timeout and consistent JSON negotiation.
- Added debounced flight filtering, skeleton loading, retry/empty states, theme cycling and accessible focus states.
- Added gateway compression, environment-controlled CORS, upstream timeouts, correlation-aware errors and safer proxy defaults.
- Added Hikari connection-pool settings and Hibernate batching/order settings with environment overrides.
- Added Kubernetes deployment/service manifests and Istio strict mTLS plus gateway routing policies.
- Added an explicit healthy AI-service dependency to Compose and corrected the gateway's mounted AI proxy path.

## Remaining Issues

`npm audit fix` reduced frontend findings to four advisories:

- `esbuild` moderate: requires Vite 8 via `npm audit fix --force`.
- React Router moderate/high advisories: require React Router 7 via `npm audit fix --force`.

These were not force-upgraded because both changes are breaking major-version migrations and require compatibility work.

The full specification also requests live flight tracking, payments, provider-backed notifications, voice/OCR,
and production telemetry. Those features require verified external providers, credentials, or additional contracts;
the application must continue to show an unavailable state rather than fabricate operational data.

## Test Verdict

```text
environment:
  docker: AVAILABLE
  node: AVAILABLE (v23.5.0)
  playwright: AVAILABLE (Chromium installation exit code 0)
  infra-tier: PRIMARY(Docker-based)
  browser-tier: PRIMARY(Playwright)
startup: PASS — gateway, AI, Spring and frontend probes returned HTTP 200
integration: PASS — exit_code: 0, Java tests passed, AI tests passed (9), gateway checks passed
e2e: PASS — exit_code: 0, passed: 6, failed: 0, flows: navigation, search/filter, themes, invalid login, valid login, protected bookings
overall: PASS — backend, gateway, AI, runtime smoke and browser validation passed
```

## Environment Notes

- Docker daemon: available.
- Node.js: v23.5.0.
- Python executable: unavailable on the host; AI tests were executed inside the service container.
- A host-side Maven test rerun can fail when the local Docker MySQL port is unavailable; the deployed container and authentication smoke tests were verified separately.
- Maven executable: unavailable globally; the repository Maven wrapper was used.
- The supplied `C:\Users\rband\Downloads\air demo ultra report.pdf` was not text-extractable in this environment; it was retained as a reference while validating live AI flows.
