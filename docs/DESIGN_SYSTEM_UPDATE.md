# Atualização de Design System - Border Radius Tokens

> Data: 14/12/2025
> Contexto: Ajuste de consistência visual para Badges e elementos compactos.

## Padrões de Border Radius Atualizados

Conforme solicitação e revisão visual, os tokens de `border-radius` devem seguir a seguinte hierarquia:

| Token | Valor (Tailwind) | Pixel | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Small** | `rounded-sm` | 4px | Checkboxes, Tags muito pequenas |
| **Medium** | `rounded-md` | 6px | **Badges**, Buttons (compact), Inputs |
| **Large** | `rounded-lg` | 8px | Buttons (default), Inputs (default), Containers pequenos |
| **X-Large** | `rounded-xl` | 12px | Cards, Dropdowns, Popovers |
| **2X-Large**| `rounded-2xl` | 16px | Modals, Drawers, Containers grandes |
| **Full** | `rounded-full` | 9999px| Avatars, Status Dots, Icon Buttons circulares |

### Mudança Específica (Badge)

O componente `Badge` foi migrado de `rounded-full` para `rounded-md` para transmitir uma aparência mais técnica e estruturada, diferenciando-se de botões pílula ou status dots.

**Antes:**
```tsx
className="rounded-full" // Formato Pílula
```

**Depois:**
```tsx
className="rounded-md" // Formato Bloco Compacto (6px)
```

Isso alinha a aplicação com a estética mais moderna de dashboards densos em informação.
