import { Resend } from "resend";

// Single Resend client instance — import this everywhere email sending is needed
export const resend = new Resend(process.env.RESEND_API_KEY!);
