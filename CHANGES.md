# QDC Performance Optimisation — Change Log

## Summary
The original `quickdental_local_v8_6.html` (957 KB, 16,569 lines) has been
split into a production-ready multi-file structure.

## Initial Page Load: 957 KB → 109 KB (gzip)

| File | Loaded | Gzip |
|------|--------|------|
| `index.html` | Always | 48 KB |
| `public.js` | Always (deferred) | 55 KB |
| `config.js` | Always | 2 KB |
| `styles.css` | Always (async) | 3 KB |
| **Total initial** | | **109 KB** |

## Deferred (never downloaded by public visitors)

| File | Trigger | Gzip |
|------|---------|------|
| `staff.js` | After staff login | 57 KB |
| `staff-extras.js` | After staff login | 21 KB |
| `staff-panels.html` | After staff login | 24 KB |
| `msgboard.js` | After staff login | 2 KB |
| `chatbot.js` | On first chat click | 20 KB |

## Specific Optimisations

### 1. Canvas — lazy slide initialisation
Only the first (RCT) canvas animation is initialised on load.
The other 5 canvases initialise only when their slide becomes active.
`requestAnimationFrame` loops for hidden slides never start.

### 2. Staff dashboard — fully deferred
229 KB of staff HTML panels are fetched via `fetch('/js/staff-panels.html')`
only after the login button is clicked. The page loads a 100-byte placeholder.
The JS (staff.js, staff-extras.js, msgboard.js) is loaded in sequence after
the panels HTML is injected.

### 3. QDC_staff stub
A lightweight stub replaces the full `QDC_staff` object on page load.
The stub handles the login modal (which is inline HTML, always present)
and triggers bundle loading. Once `staff.js` loads, it redefines `QDC_staff`.

### 4. Chatbot — on-demand
`qdcChat` is a stub that shows the window immediately and lazy-loads
`chatbot.js` on first click. The loading indicator appears instantly.

### 5. CSS split
- Critical CSS (nav, hero, layout) → inlined in `<head>` (zero render-blocking)
- Secondary CSS → `<link rel="preload">` loaded asynchronously

### 6. Prefetch hints
After 3 seconds of idle time, the browser prefetches the staff bundle
into cache so it's ready before the staff member finishes typing their password.

### 7. HTML minification
Comments stripped, whitespace collapsed: 427 KB → 204 KB (52% reduction).

### 8. public.js deferred
The 208 KB public engine (cursor, nav, canvas slideshow, scroll reveals,
FAQ accordion, appointment form) loads with `defer` — HTML parses faster.
