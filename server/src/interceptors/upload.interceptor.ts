import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const file = await request.file;
    if (file) {
      const downloadUrl = await this.uploadService.upload(file);
      request['fileUrl'] = downloadUrl;
    }
    return next.handle();
  }
}
