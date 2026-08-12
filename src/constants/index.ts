export const cookie_name = "autoflow-session";
export const bucket= process.env.S3_BUCKET
if(!bucket ) throw new Error("missing bucket name")