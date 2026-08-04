import test from "node:test";
import assert from "node:assert/strict";
import { greet, SUPPORTED_LOCALES } from "../src/index.js";

test("saludo por defecto", async (t) => {
  await t.test("sin argumentos saluda al mundo", () => {
    assert.equal(greet(), "Hello, world!");
  });

  await t.test("nombre vacío cae al default", () => {
    assert.equal(greet(""), "Hello, world!");
  });

  await t.test("nombre con solo espacios cae al default", () => {
    assert.equal(greet("   "), "Hello, world!");
  });
});

test("saludo con nombre", async (t) => {
  await t.test("usa el nombre provisto", () => {
    assert.equal(greet("Ada"), "Hello, Ada!");
  });

  await t.test("recorta espacios sobrantes", () => {
    assert.equal(greet("  Ada  "), "Hello, Ada!");
  });
});

test("opciones", async (t) => {
  await t.test("shout devuelve mayúsculas", () => {
    assert.equal(greet("Ada", { shout: true }), "HELLO, ADA!");
  });

  await t.test("locale es", () => {
    assert.equal(greet("Ada", { locale: "es" }), "¡Hola, Ada!");
  });

  await t.test("shout y locale combinados", () => {
    assert.equal(greet("Ada", { shout: true, locale: "es" }), "¡HOLA, ADA!");
  });
});

test("validación de entrada", async (t) => {
  await t.test("rechaza nombre no-string", () => {
    assert.throws(() => greet(42), TypeError);
    assert.throws(() => greet(null), TypeError);
  });

  await t.test("rechaza locale desconocido", () => {
    assert.throws(() => greet("Ada", { locale: "fr" }), RangeError);
  });
});

test("contrato público", async (t) => {
  await t.test("SUPPORTED_LOCALES es inmutable", () => {
    assert.ok(Object.isFrozen(SUPPORTED_LOCALES));
  });

  await t.test("todo locale declarado funciona", () => {
    for (const locale of SUPPORTED_LOCALES) {
      assert.doesNotThrow(() => greet("Ada", { locale }));
    }
  });
});