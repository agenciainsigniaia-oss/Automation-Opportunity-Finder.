<div align="center">
<img width="1200" height="400" alt="Automation Opportunity Finder Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚀 Automation Opportunity Finder (MVP)
### Transforma procesos manuales en eficiencia automatizada con IA.
</div>

---

## 📝 Descripción
**Automation Opportunity Finder** es una herramienta diseñada para consultores y agencias de automatización. Permite capturar información de clientes potenciales mediante un asistente interactivo (texto y voz), analizar sus procesos manuales utilizando **Google Gemini AI** para identificar oportunidades de automatización, calcular el ROI estimado y gestionar el envío de propuestas comerciales personalizadas.

## ✨ Características Principales
- **PWA (Progressive Web App)**: Instalable en dispositivos móviles y escritorio, con soporte offline y diseño mobile-first.
- **Asistente de Diagnóstico Inteligente**: Captura leads mediante un wizard que admite entrada de texto y grabaciones de voz (transcritas automáticamente).
- **Análisis de Oportunidades con IA**: Identifica cuellos de botella y estima ahorros anuales en tiempo y dinero utilizando Google Gemini.
- **Gestor de Cotizaciones (Quote Manager)**: Crea propuestas personalizadas seleccionando oportunidades específicas del diagnóstico.
- **Compositor de Emails con IA**: Redacción asistida de correos electrónicos con enlaces de seguimiento públicos.
- **Integración con n8n**: Envío real de correos electrónicos a través de Gmail mediante flujos de trabajo automatizados.
- **Panel de Gestión de Clientes**: Historial completo de diagnósticos y estados de envío de cotizaciones.
- **Reportes Públicos**: Generación de páginas de aterrizaje dinámicas para que los clientes consulten su análisis personalizado.

## 🛠️ Stack Tecnológico
- **Frontend**: React 19, Vite 6, TypeScript 5.
- **Estilos**: Tailwind CSS 4.0 (Mobile-first).
- **PWA**: vite-plugin-pwa (Service Workers, Offline mode).
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
git clone https://github.com/agenciainsigniaia-oss/Automation-Opportunity-Finder.git
cd Automation-Opportunity-Finder
npm install
```

### 3. Variables de Entorno
Copia el archivo de ejemplo y añade tus propias credenciales:
```bash
cp .env.example .env.local
```
Edita `.env.local` con tus datos:
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Desde el panel de Supabase (Settings -> API).
- `VITE_GEMINI_API_KEY`: Consíguela en [Google AI Studio](https://aistudio.google.com/app/apikey).
- `VITE_N8N_WEBHOOK_URL`: La URL del webhook de tu flujo en n8n.

### 4. Configuración de Base de Datos
Ejecuta el script contenido en `setup_db.sql` en el **SQL Editor** de tu proyecto de Supabase para crear las tablas y configurar las políticas de seguridad (RLS).

### 5. Configuración de n8n
Consulta el manual detallado en [docs/n8n_workflow_setup.md](./docs/n8n_workflow_setup.md) para importar el workflow de envío de correos.

### 6. Ejecutar y Probar PWA
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`. 
Para probar las características de PWA (instalación/offline) en desarrollo, utiliza:
```bash
npm run build
npm run preview
```


## 📂 Estructura del Proyecto
- `/components`: Componentes de interfaz (Dashboard, Wizard, Managers).
- `/services`: Lógica de comunicación con Supabase, Gemini y n8n.
- `/lib`: Configuración de clientes (Supabase).
- `/docs`: Documentación técnica y manuales de setup.

---
<div align="center">
Desarrollado por <b>Agencia Insignia OSS</b>
</div>
