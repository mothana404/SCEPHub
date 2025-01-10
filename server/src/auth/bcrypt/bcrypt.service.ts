import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(data: string): Promise<string> {
    const salt = await genSalt();
    return await hash(data, salt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    try {
      const value = await compare(data, encrypted);
      return value;
    } catch (error) {
      return error;
    }
  }
}
