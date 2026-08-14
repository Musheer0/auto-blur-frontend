// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "blur-field" ,eventKey:process.env.INNGEST_EVENT_KEY!});
