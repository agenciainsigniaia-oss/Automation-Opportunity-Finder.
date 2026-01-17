# Tasks - Quote Manager & Client Manager Feature

## Phase 1: Database & Backend
- [x] Add `emails_sent` table to Supabase (quote_id, subject, body, sent_at, status)
- [x] Create `emailService.ts` for n8n webhook integration (send payload, handle response)
- [x] Add `getAllClients` and `updateClient` functions to `supabaseService.ts`
- [x] Update RLS policies to allow inserts and updates on `emails_sent` and `clients`

## Phase 2: n8n Workflow
- [x] Create webhook trigger node (simplified payload: email, subject, body)
- [x] Configure Gmail node (send email with frontend-generated content)
- [x] Add webhook response node (return success/failure confirmation)
- [x] Remove Gemini agent from n8n (now handled client-side for better control)

## Phase 3: Frontend - Quotes Page
- [x] Create `QuotesManager.tsx` with split layout:
  - Left: Email Composer (client selector, subject, body textarea, AI assist button, send button)
  - Right: Sent Emails History (list with status badges)
- [x] Add route `/quotes` in `App.tsx`
- [x] Add "Cotizaciones" menu item to sidebar in `Layout.tsx`

## Phase 4: Frontend - Clients Page
- [x] Create `ClientsManager.tsx` for managing lead data
- [x] Implement search and filter functionality for clients
- [x] Implement inline editing for client contact info (name, company, email)
- [x] Add route `/clients` in `App.tsx`
- [x] Add "Clientes" menu item to sidebar in `Layout.tsx`

## Phase 5: Integration & Polish
- [x] Connect email composer to n8n webhook
- [x] Auto-populate client context on selection
- [x] Insert dynamic quote share link via button
- [x] Display feedback/error alerts on send attempt
- [x] Refresh history list ONLY on successful n8n response verification

## Phase 6: Verification & Git
- [x] Test full email send flow (compose → n8n → Gmail → history)
- [x] Verify Gemini-generated email quality (client-side generation)
- [x] Check error handling for failed database inserts
- [x] Update project `README.md` with MVP details and setup guide
- [x] Perform full git commit/push with centralized identity (`agenciainsigniaia-oss`)
- [x] Set up automated commit workflow rules
