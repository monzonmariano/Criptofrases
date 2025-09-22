# Documento 7: Guía del Frontend - Cómo "Piensa" una Aplicación en React

Este documento desglosa los conceptos clave de React que hemos utilizado y cómo se aplican en nuestro proyecto para crear una interfaz de usuario interactiva.

## El Corazón de React: Los Componentes

Piensa en una aplicación de React como una construcción hecha con **piezas de Lego**. Cada pieza es un **Componente**: una porción de la interfaz de usuario (un botón, un formulario, una página entera) que tiene su propia lógica, su propio estilo y su propio estado.

En nuestro proyecto, `CryptoSolverView.jsx` es un componente grande (una "página"), mientras que un botón o un campo de texto podrían ser componentes más pequeños. Esta modularidad hace que el código sea increíblemente organizado y reutilizable.

## La "Memoria" de un Componente: El Hook `useState`

Un componente necesita "recordar" cosas, como lo que el usuario ha escrito en un campo de texto o la lista de soluciones recibida de la API. Esta memoria se llama **estado (state)**.

Para gestionar esta memoria, usamos el "hook" `useState`. Un hook es una función especial de React que nos "engancha" a sus funcionalidades internas.

**La Pizarra Mágica (`useState`)**
Imagina que cada componente tiene una pequeña pizarra mágica.
* `const [cryptogram, setCryptogram] = useState('');`

Esta línea se traduce como:
1.  **`useState('')`**: "Crea una nueva pizarra para mí, y escribe `''` (una cadena vacía) en ella como valor inicial."
2.  **`cryptogram`**: "Dame una variable llamada `cryptogram` que siempre me mostrará lo que está escrito en la pizarra en este momento." (Solo lectura).
3.  **`setCryptogram`**: "Dame un 'marcador mágico' llamado `setCryptogram`. Esta es la **única** forma permitida de borrar y escribir algo nuevo en la pizarra."

Cuando llamas a `setCryptogram('nuevo texto')`, React borra la pizarra, escribe el nuevo texto y, lo más importante, **redibuja automáticamente** esa parte de la pantalla para que el usuario vea el cambio.

## "Efectos Secundarios" y Llamadas a API: El Hook `useEffect`

¿Cómo hacemos para que la vista de "Historial" pida los datos a la API justo cuando aparece en pantalla? Para esto, usamos otro hook: `useEffect`.

`useEffect` nos permite ejecutar código en respuesta a eventos del "ciclo de vida" de un componente.

**El Desencadenador "Cuando..." (`useEffect`)**
```javascript
// Dentro de HistoryView.jsx
useEffect(() => {
  // Código a ejecutar...
  fetchHistory(); 
}, []);
```
Esto se traduce como:
> "**Cuando** este componente (`HistoryView`) aparezca en pantalla por primera vez, ejecuta el código que está adentro. El `[]` al final significa: no lo vuelvas a ejecutar nunca más, solo la primera vez."

Es el lugar perfecto para realizar la llamada inicial a la API para cargar datos.

## El Flujo Interactivo Completo

Con estos conceptos, el ciclo de vida de nuestra aplicación es el siguiente:

1.  **Acción del Usuario**: Un usuario escribe en el `textarea` del criptograma.
2.  **Manejador de Evento**: El atributo `onChange` del `textarea` llama a nuestra función `setCryptogram`.
3.  **Actualización de Estado**: `setCryptogram` actualiza el valor en nuestra "pizarra mágica".
4.  **Re-renderizado**: React detecta que el estado ha cambiado y vuelve a dibujar la pantalla para mostrar el nuevo texto.
5.  **Envío a la API**: El usuario hace clic en "Resolver". El `onClick` llama a nuestra función `handleSubmit`.
6.  **Llamada Asíncrona**: `handleSubmit` llama a nuestro `apiClient`, que envía la petición al backend. Mientras espera, activa el estado `isLoading` a `true` (lo que muestra "Resolviendo...").
7.  **Respuesta y Actualización Final**: Cuando el backend responde, `handleSubmit` guarda la lista de soluciones en el estado `solutions` usando `setSolutions`. React vuelve a dibujar la pantalla, esta vez para mostrar la lista de soluciones.

Es este ciclo de **Estado -> Interfaz -> Acción del Usuario -> Actualización de Estado** lo que hace que las aplicaciones de React sean tan dinámicas y potentes.