---
name: n8n-builder
description: Skill para diseñar y generar flujos de n8n automáticamente via REST API.
---

# n8n Scenario Builder Skill

Este skill permite a Antigravity actuar como un arquitecto de automatizaciones en n8n, traduciendo requerimientos en lenguaje natural a JSON compatible con n8n y enviándolos directamente a la instancia del usuario.

## Requisitos
Para utilizar este skill, el usuario debe configurar las siguientes variables en `.env.local`:
- `N8N_API_KEY`: Tu API Key generada en n8n (Personal Settings -> API).
- `N8N_BASE_URL`: La URL base de tu instancia (ej: `https://n8n.tudominio.com`).

## Capacidades
1. **Traducción de Idea a Nodos**: Diseñar la arquitectura de nodos (Triggers, Actions, Connections).
2. **Generación de JSON**: Crear el objeto `nodes` y `connections` siguiendo el esquema oficial de n8n v2.
3. **Despliegue Directo**: Usar el script `n8n-api.js` para crear el workflow en estado "draft" o "active".

## Instrucciones para Antigravity
1. Analizar el requerimiento del usuario.
2. Identificar qué nodos de n8n se necesitan (ej: `n8n-nodes-base.httpRequest`, `n8n-nodes-base.set`, `n8n-nodes-base.webhook`).
3. Generar el JSON del workflow.
4. Ejecutar `node .agent/skills/n8n-builder/scripts/n8n-api.js create` pasando el JSON.

## Ejemplo de uso
"Antigravity, crea un escenario en n8n que reciba un webhook, busque una fila en Google Sheets por email, y si existe, mande un mensaje de Slack."
