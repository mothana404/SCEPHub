import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Jwtservice {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(
    user_id: bigint,
    user_email: string,
    role: bigint,
  ): Promise<string> {
    const access_token = await this.jwtService.signAsync(
      { user_id, user_email, role },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN, // shorter expiration
      },
    );
    return access_token;
  }

  async generateRefreshToken(
    user_id: bigint,
    user_email: string,
    role: bigint,
  ): Promise<string> {
    const refresh_token = await this.jwtService.signAsync(
      { user_id, user_email, role },
      {
        secret: process.env.REFRESH_SECRET_KEY, // separate secret for refresh tokens
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN, // longer expiration
      },
    );
    return refresh_token;
  }

  async verifyRefreshToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_SECRET_KEY,
    });
  }
}
