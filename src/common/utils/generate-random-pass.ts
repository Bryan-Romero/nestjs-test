/**
 * Generates a random password of a specified length.
 *
 * @param {number} passwordLength - The length of the password to be generated
 * @return {string} The randomly generated password
 */
export function generateRandomPassword(passwordLength: number): string {
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialCharacters = '@$!%*?&';

  const allCharacters =
    lowercaseLetters + uppercaseLetters + digits + specialCharacters;

  let password = '';

  // Agrega al menos un carácter de cada conjunto
  password += getRandomChar(lowercaseLetters);
  password += getRandomChar(uppercaseLetters);
  password += getRandomChar(digits);
  password += getRandomChar(specialCharacters);

  // Completa el resto de la contraseña hasta alcanzar la longitud mínima
  while (password.length < passwordLength) {
    password += getRandomChar(allCharacters);
  }

  // Mezcla la contraseña para mayor aleatoriedad
  password = shuffleString(password);

  return password;
}

/**
 * Returns a random character from the given string of characters.
 *
 * @param {string} characters - the string of characters to choose from
 * @return {string} the randomly selected character
 */
function getRandomChar(characters: string): string {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

/**
 * Shuffles the characters in the input string.
 *
 * @param {string} str - the input string to be shuffled
 * @return {string} the shuffled string
 */
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}
