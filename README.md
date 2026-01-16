<div align="center">
<img width="1200" height="400" alt="Automation Opportunity Finder Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚀 Automation Opportunity Finder (MVP)
### Transforma procesos manuales en eficiencia automatizada con IA.
</div>

---

## 📝 Descripción
**Automation Opportunity Finder** es una herramienta diseñada para consultores y agencias de automatización. Permite capturar información de clientes potenciales mediante un asistente interactivo (texto y voz), analizar sus procesos manuales utilizando **Google Gemini AI** para identificar oportunidades de automatización, calcular el ROI estimado y gestionar el envío de propuestas comerciales personalizadas.

## ✨ Características Principales
- **Asistente de Diagnóstico Inteligente**: Captura leads mediante un wizard que admite entrada de texto y grabaciones de voz (transcritas automáticamente).
- **Análisis de Oportunidades con IA**: Identifica cuellos de botella y estima ahorros anuales en tiempo y dinero.
- **Gestor de Cotizaciones (Quote Manager)**: Crea propuestas personalizadas seleccionando oportunidades específicas del diagnóstico.
- **Compositor de Emails con IA**: Redacción asistida de correos electrónicos con enlaces de seguimiento públicos.
- **Integración con n8n**: Envío real de correos electrónicos a través de Gmail mediante flujos de trabajo automatizados.
- **Panel de Gestión de Clientes**: Historial completo de diagnósticos y estados de envío de cotizaciones.
- **Reportes Públicos**: Generación de páginas de aterrizaje dinámicas para que los clientes consulten su análisis personalizado.

## 🛠️ Stack Tecnológico
- **Frontend**: React 18, Vite, TypeScript.
- **Estilos**: Tailwind CSS 4.0.
- **Base de Datos**: Supabase (PostgreSQL + RLS).
- **IA**: Google Gemini 1.5 Pro (Análisis y redacción).
- **Automatización**: n8n (Webhooks + Gmail API).
- **Iconografía**: Lucide React.

## 🚀 Instalación y Configuración Local

### 1. Requisitos Previos
- Node.js (v18 o superior).
- Cuenta en [Supabase](https://supabase.com/).
- API Key de [Google AI Studio](https://aistudio.google.com/).
- Instancia de [n8n](https://n8n.io/).

### 2. Clonar y Configurar
```bash
git clone https://github.com/agenciainsigniaia-oss/Automation-Opportunity-Finder..git
cd Automation-Opportunity-Finder.
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_GEMINI_API_KEY=tu_gemini_api_key
VITE_N8N_WEBHOOK_URL=tu_url_de_webhook_n8n
```

### 4. Configuración de Base de Datos
Ejecuta el script contenido en `setup_db.sql` en el **SQL Editor** de tu proyecto de Supabase para crear las tablas (`clients`, `diagnostics`, `quotes`, `emails_sent`) y configurar las políticas de seguridad (RLS).

### 5. Configuración de n8n
Consulta el manual detallado en [docs/n8n_workflow_setup.md](./docs/n8n_workflow_setup.md) para importar el workflow de envío de correos.

### 6. Ejecutar
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## 📂 Estructura del Proyecto
- `/components`: Componentes de interfaz (Dashboard, Wizard, Managers).
- `/services`: Lógica de comunicación con Supabase, Gemini y n8n.
- `/lib`: Configuración de clientes (Supabase).
- `/docs`: Documentación técnica y manuales de setup.

---
<div align="center">
Desarrollado por <b>Agencia Insignia OSS</b>
</div>
