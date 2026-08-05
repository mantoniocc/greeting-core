/**
 * Genera un saludo.
 * 
 * @param {string} [name="world"] - A quien saludar. Si es vacio o solo 
 *  espacios, se usa el valor por defecto.
 * @param {object} [options]
 * @param {boolean} [options.shout=false] - Devolver el saludo en mayusculas.
 * @param {string} [options.locale="en"] - Idioma del saludo: "en" o "es".
 * @returns {string}
 * @throws {TypeError} si `name` no es un string.
 * @throws {RangeError} si `locale` no esta soportado
 * 
 * @example
 * greet("Ada");                        // "Hello, Ada!"
 * greet("Ada", {locale: "es"});        // "¡Hola, Ada!"
 * greet("Ada", {shout: true});         // "HELLO, ADA!"
 */

export function greet(name = "world", options = {}) {
    const { shout = false, locale = "en" } = options;

    if (typeof name !== "string") {
        throw new TypeError(`name debe ser string, recibido: ${typeof name}`);
    }

    const templates = {
        en: (who) => `Hello, ${who}!`,
        es: (who) => `¡Hola, ${who}!`,
        pt: (who) => `Olá, ${who}!`,
    };

    if (!(locale in templates)) {
        throw new RangeError(
            `locale no soportado: "${locale}". Validos: ${Object.keys(templates).join(", ")}`,
        );
    }

    const target = name.trim() || "world";
    const message = templates[locale](target);

    return shout ? message.toUpperCase() : message;
}

/** Locales soportados por {@link greet}. */
export const SUPPORTED_LOCALES = Object.freeze(["en", "es", "pt"]);