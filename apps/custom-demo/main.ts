import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";
// 定义一个异步函数，用于创建并且启动 Nest 应用
async function bootstrap() {
  // 使用 NestFactory 创建一个 Nest 应用实例 并传入根模块 AppModule
  // 在底层，NestFactory.create() 方法使用了一个内部的 HTTP 服务器（Express 或 Fastify）来处理传入的请求
  const app = await NestFactory.create(AppModule);

  // 注册session 中间件
  app.use(
    session({
      name: "sid", //设置cookie的name，默认值是：connect.sid
      secret: "atguigu", //参与加密的字符串（又称签名）  加盐
      saveUninitialized: false, //是否为每次请求都设置一个cookie用来存储session的id
      resave: true,
      // store: MongoStore.create({
      //   mongoUrl: "mongodb://127.0.0.1:27017/session", //数据库的连接配置
      // }),
      cookie: {
        httpOnly: true, // 开启后前端无法通过 JS 操作
        maxAge: 1000 * 10, // 这一条 是控制 sessionID 的过期时间的！！！
      },
    })
  );
  // 使用 app.listen 方法监听 3000 端口
  await app.listen(3000);
}

bootstrap();
