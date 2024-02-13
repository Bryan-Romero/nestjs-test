import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class BcryptjsService {
  async hashData(data: string) {
    return await bcryptjs.hashSync(data, 10);
  }

  async compareStringHash(data: string, hash: string) {
    return await bcryptjs.compareSync(data, hash);
  }

  generateRandomPassword(): string {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialCharacters = '@$!%*?&';

    const allCharacters =
      lowercaseLetters + uppercaseLetters + digits + specialCharacters;

    let password = '';

    // Agrega al menos un carácter de cada conjunto
    password += this.getRandomChar(lowercaseLetters);
    password += this.getRandomChar(uppercaseLetters);
    password += this.getRandomChar(digits);
    password += this.getRandomChar(specialCharacters);

    // Completa el resto de la contraseña hasta alcanzar la longitud mínima
    const passwordLength = 12;
    while (password.length < passwordLength) {
      password += this.getRandomChar(allCharacters);
    }

    // Mezcla la contraseña para mayor aleatoriedad
    password = this.shuffleString(password);

    return password;
  }

  private getRandomChar(characters: string): string {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  }

  private shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
}
