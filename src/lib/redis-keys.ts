export const redisKeys = {
  SESSION: (userId: string, sessionId: string) =>
    `session:${sessionId}:user:${userId}`,
  WORKFLOW: (userId: string, workflowId: string) =>
    `workflow:${workflowId}:user:${userId}`,
  CREDENTIAL_BY_TYPE: (userId: string, type: string) =>
    `credential:type:${type}:user:${userId}`,
  WORKFLOW_RUN: (workflowId: string) => `workflow:${workflowId}`,
  CREDENTIAL: (userId: string, id: string) => `credential:${id}:user:${userId}`,
  AI_USAGE: (userId: string) => `ai-usage:${userId}`,
  GENERATION: (id: string, userId: string) => `generation:${id}:user:${userId}`,
  MEDIA: (id: string, userId: string) => `media:${id}:user:${userId}`,
  FACE: (id: string, userId: string) => `face:${id}:user:${userId}`,
  S3_MEDIA_URL:(key:string)=>`S3_MEDIA:KEY:${key}`
};
