import { Logger } from "./logger";
// 引入 Logger 模块
import { NestApplication } from "./nest-application";
// 引入 NestApplication 模块
export class NestFactory {
  // 导出 NestFactory 类
  static async create<T>(module: any): Promise<NestApplication> {
    // 定义一个静态的异步方法 create，接收一个参数 module，返回一个 Promise，Promise 的类型是 NestApplication
    Logger.log("Starting Nest application...", "NestFactory");
    // 使用 Logger 记录一条信息，表示正在启动 Nest 应用
    const app = new NestApplication(module);
    // 创建一个新的 NestApplication 实例，传入 module 参数
    return app;
    // 返回创建的 NestApplication 实例
  }
}
