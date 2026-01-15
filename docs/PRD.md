# PRD: Automation Opportunity Finder (MVP+)

## 1. Executive Summary
**Vision:** Una plataforma de diagnóstico de alto impacto para consultores de IA que transforma entrevistas operativas en propuestas comerciales con cálculos de ROI precisos y recomendaciones técnicas.
**KPI de Éxito:** Reducción del tiempo de preventa en un 70%; Aumento del ticket promedio mediante visualizaciones claras de ahorro económico.

## 2. Mobile Experience (Mobile-First)
*   **UI Architecture:** Inspirada en interfaces "Clean & Bold". Fondos neutros, tarjetas con bordes redondeados (rounded-2xl) y sombras sutiles.
*   **Navigation:** Bottom Tab Bar persistente con Glassmorphism.
*   **Micro-interacciones:** Uso de React 19 Transitions para cambios de estado fluidos sin bloqueos de UI.
*   **Responsive Dialogs:** Wrapper unificado que renderiza Drawer en < 768px y Dialog en desktop.

## 3. Tech Stack & Architecture (Updated)
*   **Frontend:** Next.js 16 (App Router) + React 19 (Canary/Latest features). *(Adapted to Client-side React 18 for this prototype)*
*   **Language:** TypeScript (Strict mode, custom types for AI schemas).
*   **Styling:** Tailwind CSS + Shadcn UI (Customized with branding fonts).
*   **Backend/Auth:** Supabase (PostgreSQL + RLS + GoTrue).
*   **Forms:** React 19 useActionState para manejo de formularios del wizard sin librerías externas pesadas.
*   **IA:** Gemini 2.5 Flash (Análisis de inputs) + Nano Banana Pro (Opcional para portadas de reporte).

## 4. Database Schema (Supabase)
### clients
*   `id`: uuid (PK)
*   `user_id`: uuid (FK -> auth.users)
*   `name`, `email`, `company_name`: text
*   `country_code`: text (iso2 para lógica de precios)
*   `status`: lead | active_proposal | converted | lost

### diagnostics
*   `id`: uuid (PK)
*   `client_id`: uuid (FK)
*   `version`: integer (autoincrement por cliente)
*   `wizard_data`: jsonb (inputs del consultor)
*   `analysis_result`: jsonb (oportunidades, ROI, stack técnico)
*   `is_archived`: boolean

### quotes
*   `id`: uuid (PK)
*   `diagnostic_id`: uuid (FK)
*   `items`: jsonb (desglose de servicios y precios)
*   `currency`: text
*   `valid_until`: date

## 5. Expanded User Stories & Features

### Epics 1: Gestión de Prospectos y Perfilado
*   **US1.1:** Como consultor, quiero registrar un cliente vinculándolo a su industria y país para que la IA aplique benchmarks locales de salarios y costos.
*   **US1.2:** Como consultor, quiero ver un Dashboard que priorice los "Seguimientos Pendientes" basados en la urgencia detectada en el diagnóstico.

### Epics 2: Wizard de Diagnóstico Inteligente (Core)
*   **US2.1:** Como consultor, quiero completar un formulario multi-paso donde pueda marcar qué herramientas (HubSpot, Zapier, etc.) ya tiene el cliente para evitar redundancias en el stack recomendado.
*   **US2.2:** Como consultor, quiero capturar "Puntos de Dolor" específicos mediante etiquetas dinámicas generadas por IA según la industria seleccionada.
*   **US2.3:** (Nueva) Como consultor, quiero adjuntar una breve descripción de voz (vía Web Speech API) para que la IA extraiga contexto adicional del problema operativo.

### Epics 3: Reporte Consultivo y ROI
*   **US3.1:** Como consultor, quiero un gráfico interactivo que compare "Costo Actual Manual" vs "Costo Proyectado con Automatización" a 6 y 12 meses.
*   **US3.2:** (Nueva) Como consultor, quiero poder editar las recomendaciones de la IA antes de que el cliente las vea para asegurar precisión técnica.
*   **US3.3:** Como consultor, quiero generar un link público temporal del reporte para que el cliente lo revise sin necesidad de login.

### Epics 4: Cotización y Cierre
*   **US4.1:** Como consultor, quiero convertir una oportunidad de automatización en un ítem de línea de cotización con un solo tap.
*   **US4.2:** (Nueva) Como consultor, quiero aplicar "Multiplicadores de Urgencia" al precio final basados en la capacidad de inversión declarada por el cliente.