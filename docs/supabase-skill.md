# Supabase Skill & Architecture

## Row Level Security (RLS)
Security is paramount as consultants handle sensitive client operational data.

1.  **Clients Table:**
    *   `auth.uid() = user_id`: Consultants can only see their own clients.
2.  **Diagnostics Table:**
    *   Inherits permission via `client_id`. A join policy ensures `client.user_id` matches `auth.uid()`.

## Webhooks & Edge Functions
*   **Trigger:** `INSERT ON diagnostics`
*   **Action:** Calls a Supabase Edge Function `analyze-diagnostic`.
*   **Logic:** The Edge Function calls the Gemini API (as defined in `geminiService.ts`), calculates ROI, and updates the `analysis_result` column in the `diagnostics` table. This keeps the frontend snappy and hides AI logic/keys.

## Realtime
Enable Realtime on the `diagnostics` table so the frontend (Wizard) receives a push update when the Edge Function completes the analysis (`is_analyzing` -> `false`).