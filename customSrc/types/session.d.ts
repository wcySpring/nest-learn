// session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
    // 你可以在这里添加其他会话属性
    [key: string]: any;
  }
}
