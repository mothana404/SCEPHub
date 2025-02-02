import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Express } from 'express';

@Injectable()
export class UploadService {
  #db: FirebaseFirestore.Firestore;
  #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = firebaseApp.firestore();
    this.#collection = this.#db.collection('my-gallery-2e2f2.appspot.com');
  }

  async getFileDownloadUrl(fileName: string): Promise<string> {
    const bucket = this.firebaseApp.storage().bucket();
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2027',
    });
    return url;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const bucket = this.firebaseApp.storage().bucket();
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileObject = bucket.file(fileName);
    await fileObject.save(file.buffer, {
      contentType: file.mimetype,
    });
    return await this.getFileDownloadUrl(fileName);
  }
}
