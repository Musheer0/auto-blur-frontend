"use client"
export async function uploadToS3(
  file: File,
  upload: {
    url: string;
    fields: Record<string, string>;
    maxSize: number;
  }
) {
  if (file.size > upload.maxSize) {
    throw new Error(
      `File is too large. Maximum size is ${upload.maxSize / 1024 / 1024} MB`
    );
  }

  const formData = new FormData();

  // Add S3's presigned fields
  Object.entries(upload.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // IMPORTANT: file must be appended last
  formData.append("file", file);

  const response = await fetch(upload.url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("S3 upload failed");
  }

  return true;
}