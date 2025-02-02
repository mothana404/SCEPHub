import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Users } from 'src/database/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY') private readonly UserModel: typeof Users,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      const access_token: string = request.cookies['access_token'];
      const refresh_token: string = request.cookies['refresh_token'];
      //   console.log(request.cookies['refresh_token']);
      try {
        if (!access_token) throw new UnauthorizedException(access_token);
        const userPayload = await this.jwtService.verifyAsync(access_token, {
          secret: process.env.SECRET_KEY,
        });
        const user = await this.findUser({ userPayload });
        if (!user || !user.dataValues.user_email) {
          throw new UnauthorizedException('Access token missing');
        }
        request['user'] = user.dataValues;
        return true;
      } catch (error) {
        // console.log('New Refresh Token');
        if (refresh_token) {
          try {
            const refreshPayload = await this.jwtService.verifyAsync(
              refresh_token,
              {
                secret: process.env.REFRESH_SECRET_KEY,
              },
            );
            const user = await this.findUser({ userPayload: refreshPayload });
            if (!user || !user.dataValues.user_email) {
              throw new UnauthorizedException('Refresh token invalid');
            }
            const newAccessToken = this.jwtService.sign(
              {
                user_id: user.user_id,
                user_email: user.user_email,
                role: user.role,
              },
              {
                secret: process.env.SECRET_KEY,
                expiresIn: '15m',
              },
            );
            response.cookie('access_token', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            });
            request['user'] = user.dataValues;
            return true;
          } catch (refreshError) {
            throw new UnauthorizedException('Invalid or expired refresh token');
          }
        } else {
          console.log(error);
          throw new UnauthorizedException('Invalid or expired refresh token');
        }
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('error');
    }
  }

  private async findUser(payload: any) {
    const user = await this.UserModel.findOne({
      where: {
        user_id: payload.userPayload.user_id,
        user_email: payload.userPayload.user_email,
        role: payload.userPayload.role,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
