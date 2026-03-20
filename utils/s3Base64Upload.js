import { PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";
import { v4 as uuid } from "uuid";


export const uploadBase64ToS3 = async (base64, folder) => {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);

  if (!matches) {
    throw new Error("Invalid base64");
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  const extension = mimeType.split("/")[1];

  const public_id = `${folder}/${uuid()}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: public_id,
      Body: buffer,
      ContentType: mimeType,
    })
  );

  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${public_id}`;

  return { public_id, url };
};


export const deleteFromS3 = async (public_id) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: public_id, // same as public_id
    })
  );
};