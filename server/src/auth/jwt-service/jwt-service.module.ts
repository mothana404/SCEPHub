import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRE_IN },
    }),
  ],
  providers: [JwtService],
  exports: [JwtModule],
})
export class JwtServiceModule {}
