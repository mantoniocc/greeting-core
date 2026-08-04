# greeting-core

Librería mínima de saludos. Ejemplo práctico de publicación a GitHub Packages.

## Instalación

Este paquete se publica en GitHub Packages, no en npmjs.com.
Ver [instrucciones de consumo](#consumo) más abajo.

## Uso

```js
import { greet } from "@tu_usuario/greeting-core";

greet();                              // "Hello, world!"
greet("Ada");                         // "Hello, Ada!"
greet("Ada", { locale: "es" });       // "¡Hola, Ada!"
greet("Ada", { shout: true });        // "HELLO, ADA!"
```

## Consumo

Pendiente — se documenta en la fase A3.

## Licencia

MIT