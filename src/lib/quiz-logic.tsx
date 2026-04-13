/**
 * Mezcla un arreglo usando el algoritmo Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Genera las opciones para un quiz asegurando que la respuesta correcta esté presente
 * y los distractores sean de la misma categoría si es posible.
 */
export function generateOptions(correctAnswer: string, allWords: string[]): string[] {
  // 1. Quitamos la correcta de la lista de posibles distractores
  const filteredWords = allWords.filter(w => w !== correctAnswer);
  
  // 2. Tomamos 3 distractores aleatorios
  const distractors = shuffleArray(filteredWords).slice(0, 3);
  
  // 3. Unimos y volvemos a mezclar para que la respuesta no siempre sea la misma posición
  return shuffleArray([correctAnswer, ...distractors]);
}