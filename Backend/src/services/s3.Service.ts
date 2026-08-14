import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import s3Client from "../config/s3";

  export async function uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ) {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    return {
      key: fileName,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    };
  }

  export async function deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
  }

  export async function getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
    });

    const response = await s3Client.send(command);

    const bytes = await response.Body!.transformToByteArray();

    return Buffer.from(bytes);
}

