# greeting-core

Librería mínima de saludos multi-idioma. Sin dependencias.

Este repositorio es un laboratorio práctico de publicación a **GitHub Packages** con GitHub Actions: versionado, publicación automatizada, procedencia firmada y gestión del ciclo de vida.

---

## Instalación

Este paquete se publica en **GitHub Packages**, no en npmjs.com. Hacen falta dos cosas: decirle a npm dónde buscar el scope, y una credencial.

### 1. Configurar el registry del scope

En el `.npmrc` de tu proyecto (este archivo **sí** se commitea, no lleva secretos):

```ini
@mantoniocc:registry=https://npm.pkg.github.com
```

### 2. Configurar tu credencial

En tu `~/.npmrc` (este archivo **nunca** se commitea):

```ini
//npm.pkg.github.com/:_authToken=TU_TOKEN
```

```bash
chmod 600 ~/.npmrc
```

> **Hace falta token incluso siendo un paquete público.** El registry npm de GitHub Packages exige autenticación siempre, a diferencia del container registry (`ghcr.io`), que permite pull anónimo de imágenes públicas.

> **El token debe ser un PAT classic** con scope `read:packages`. GitHub Packages **no soporta** fine-grained personal access tokens para el registry npm; usarlos devuelve `403 - The token provided does not match expected scopes`.

Crealo en <https://github.com/settings/tokens> → *Generate new token (classic)* → scope `read:packages` → expiración corta.

### 3. Instalar

```bash
npm install @mantoniocc/greeting-core
```

---

## Uso

```js
import { greet, SUPPORTED_LOCALES } from "@mantoniocc/greeting-core";

greet();                              // "Hello, world!"
greet("Ada");                         // "Hello, Ada!"
greet("Ada", { locale: "es" });       // "¡Hola, Ada!"
greet("Ada", { locale: "pt" });       // "Olá, Ada!"
greet("Ada", { locale: "fr" });       // "Bonjour, Ada !"
greet("Ada", { shout: true });        // "HELLO, ADA!"

SUPPORTED_LOCALES;                    // ["en", "es", "pt", "fr"]  (congelado)
```

### API

#### `greet(name?, options?)`

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `string` | `"world"` | A quién saludar. Vacío o solo espacios cae al default. |
| `options.locale` | `string` | `"en"` | Uno de `SUPPORTED_LOCALES`. |
| `options.shout` | `boolean` | `false` | Devolver en mayúsculas. |

**Devuelve:** `string`

**Lanza:**

- `TypeError` — si `name` no es un string.
- `RangeError` — si `locale` no está soportado.

#### `SUPPORTED_LOCALES`

Array congelado (`Object.freeze`) con los locales disponibles. Iterarlo es la forma segura de descubrir qué soporta la versión instalada.

---

## Requisitos

- Node.js >= 22
- ESM (`"type": "module"`). No hay build CommonJS.

---

## Verificar procedencia

Cada versión publicada lleva una **artifact attestation** firmada con Sigstore, que liga el tarball al workflow, repositorio y commit que lo produjeron.

```bash
npm pack @mantoniocc/greeting-core@0.3.0
gh attestation verify ./mantoniocc-greeting-core-0.3.0.tgz --owner mantoniocc
```

Salida esperada:

```
✓ Verification succeeded!

sha256:... was attested by:
REPO                       PREDICATE_TYPE                  WORKFLOW
mantoniocc/greeting-core   https://slsa.dev/provenance/v1  .github/workflows/release.yml@refs/tags/v0.3.0
```

Si el tarball fue alterado en cualquier byte, la verificación falla.

---

## Política de versionado

Se sigue [SemVer](https://semver.org/lang/es/). Criterio concreto para esta librería:

| Cambio | Bump |
|---|---|
| Agregar un locale nuevo | **minor** |
| Corregir un typo o bug interno sin cambiar strings de salida | **patch** |
| Cambiar el texto de un template existente | **major** — hay consumidores que comparan el string exacto |
| Quitar un locale | **major** |
| Cambiar la firma de `greet` | **major** |

Las versiones publicadas son **inmutables**: nunca se sobrescribe ni se borra una versión. Una versión con problemas se **depreca** y se publica un fix.

---

## Desarrollo

```bash
nvm use                  # usa la versión de .nvmrc
npm install
npm test                 # node --test, sin dependencias
npm run test:coverage
```

Antes de tocar `package.json`, verificá siempre qué se publicaría:

```bash
npm pack --dry-run
```

Deben aparecer solo `src/`, `README.md`, `LICENSE` y `package.json`. Si aparece `test/` o `.github/`, el campo `files` está mal.

### Workflows

| Archivo | Trigger | Qué hace |
|---|---|---|
| `ci.yml` | push / PR a `main` | Tests en Node 22 y 24; verifica el contenido del tarball |
| `release.yml` | `release: published` | Valida tag ↔ versión, publica, atestigua, smoke test |
| `cleanup-packages.yml` | cron dominical | Poda prereleases conservando un mínimo |

### Publicar

Ver [`docs/RUNBOOK.md`](docs/RUNBOOK.md).

---

## Licencia

MIT