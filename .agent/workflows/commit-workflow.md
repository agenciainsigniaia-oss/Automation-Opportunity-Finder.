---
description: Reglas para realizar commits y mantener el control de versiones
---

# Git Workflow & Commit Rules

Para mantener una base de código limpia y segura, sigue estas reglas:

1. **Frecuencia de Commits**:
   - Realiza un commit después de cada cambio "relativamente grande" (ej: crear un nuevo componente, implementar una integración, arreglar un bug complejo).
   - Siempre confirma con el usuario antes de realizar un commit automático si no estás seguro de si el cambio ya es definitivo.

2. **Calidad de Mensajes**:
   - Usa un formato detallado: `tipo: descripción corta` seguido de una lista de cambios.
   - Tipos sugeridos: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`.

3. **Verificación**:
   - Antes de committear, asegúrate de que el código compila y no tiene errores críticos visibles.

4. **Documentación**:
   - Si creas nuevas carpetas o servicios, asegúrate de que estén incluidos en el commit.

// turbo
## Pasos para el Commit
1. Ejecutar `git add .` para incluir archivos nuevos y modificados.
2. Ejecutar `git commit -m "..."` con el detalle de los cambios.
3. Informar al usuario del commit realizado.
