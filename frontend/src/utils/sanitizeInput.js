// Archivo: src/utils/sanitizeInput.js

//     Explicación del Proceso

//     cryptogram.replace(/\s*-\s*/g, '-')

//     Este paso busca cualquier guion (-) que tenga cero o más espacios (\s*) a su alrededor y los reemplaza por un guion limpio.

//     Ejemplo:

//         "1 - 2" se convierte en "1-2".

//         "1-   2" se convierte en "1-2".

//         "2    -3" se convierte en "2-3".

//     .trim().replace(/\s+/g, ' ')

//     Después del primer paso, la cadena ya no tiene espacios junto a los guiones, pero podría tener espacios extra entre las palabras y en los extremos.

//     trim() elimina los espacios iniciales y finales.

//     replace(/\s+/g, ' ') busca una o más secuencias de espacios (\s+) y las reemplaza con un solo espacio.





export const sanitizeInput = (cryptogram, clues) => {
  // Primero, elimina todos los espacios que rodean a los guiones
  // y luego colapsa cualquier secuencia de espacios restante a un solo espacio.
  const sanitizedCryptogram = cryptogram
    .replace(/\s*-\s*/g, '-')
    .trim()
    .replace(/\s+/g, ' ');

  // Mantiene la lógica para las pistas, eliminando todos los espacios.
  const sanitizedClues = clues.trim().toLowerCase().replace(/\s/g, '');

  return { sanitizedCryptogram, sanitizedClues };
};



