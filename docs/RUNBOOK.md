# Runbook — greeting-core

Paquete npm publicado en GitHub Packages.

## Publicar una versión

1. Mergear los cambios a `main` y esperar CI verde.
2. Bumpear y taggear de forma atómica:

       npm version [patch|minor|major] -m "chore(release): %s"
       git push --follow-tags

3. Crear el Release (dispara la publicación):

       gh release create vX.Y.Z --generate-notes --verify-tag

4. Verificar que corrieron `verify` → `publish` → `smoke-test`.

Nunca crear el Release desde la UI escribiendo el tag a mano:
el guard de `verify` falla si el tag no coincide con `package.json`.

## Criterio de versionado

| Cambio | Bump |
|---|---|
| Agregar un locale | minor |
| Corregir un template | patch |
| Quitar un locale o cambiar una firma | major |

## Consumir el paquete

`~/.npmrc` (nunca en el repo):

    //npm.pkg.github.com/:_authToken=<PAT classic con read:packages>

`.npmrc` del proyecto consumidor (sí se commitea):

    @mantoniocc:registry=https://npm.pkg.github.com

Nota: GitHub Packages para npm NO soporta PAT fine-grained.
Debe ser classic.

## Verificar procedencia

    npm pack @mantoniocc/greeting-core@X.Y.Z
    gh attestation verify ./mantoniocc-greeting-core-X.Y.Z.tgz --owner mantoniocc

## Versión con bug

Deprecar, no borrar:

    npm deprecate @mantoniocc/greeting-core@X.Y.Z "motivo. Usar >=A.B.C"

Borrar solo ante secretos filtrados o problema legal. Rompe lockfiles.

## Workflows

| Archivo | Trigger | Qué hace |
|---|---|---|
| `ci.yml` | push/PR a main | Tests en Node 22 y 24, verifica contenido del tarball |
| `release.yml` | release published | Valida, publica, atestigua, smoke test |
| `cleanup-packages.yml` | cron dominical | Poda prereleases, conserva mínimo 10 |