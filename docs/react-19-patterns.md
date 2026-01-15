# React 19 & Next.js 16 Patterns

## Overview
Although this prototype runs in a standard React 18 environment, the design architecture is prepared for migration to Next.js 16 App Router.

## useActionState
In the production build, we replace standard `useState` form submission handlers with `useActionState`. This allows us to handle form submissions (like the Diagnostic Wizard) on the server, progressively enhancing the form even if JS hasn't fully loaded.

```typescript
// Future Implementation
const [state, formAction] = useActionState(submitDiagnostic, initialState);
// <form action={formAction}> ...
```

## Optimistic UI
We aim for "Zero Latency" feel. In the `DiagnosticWizard`, when clicking "Next", we utilize `useTransition` (or optimistic state updates) to immediately render the next step while validating data in the background.

## Server Components (RSC)
*   **Dashboard:** Should be a Server Component fetching `clients` directly from Supabase.
*   **Wizard:** A Client Component (due to heavy interactivity and local state).
*   **Report:** A Server Component that fetches the `analysis_result` JSONB, passing it to a Client Component for the Recharts visualization.