import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";

//    const app = new NestApplication(module);
export class NestApplication {
  // 实例化一个express
  private readonly app: Express = express();

  constructor(protected readonly module) {}

  // 启动Http 服务
  listen(port: Number) {
    this.app.listen(port, () => {
      // 启动服务
      console.log(`Application is running on http://localhost:${port}`);
    });
  }
}
