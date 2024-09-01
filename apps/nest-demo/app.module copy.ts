// controller 用来处理请求
import { UserController } from "src/injectable/user.controller";
import { AppController } from "./app.controller";

import { Module } from "@nestjs/common";
import { UserModule } from "src/injectable/user.module";
import { UserController1 } from "src/injectable/user.controller1";
import { UserModule1 } from "src/injectable/user.module1";
import { UserController2 } from "src/injectable/user.controller2";
import { CatsModule } from "./src/core/cats/cats.module"
import { AppService } from "./app.service"
import { CatsController } from "src/injectable/catcontroller"
import { UserModule as UserM } from "./src/user/user.module"
// nest 创建一个新的模块。这个模块是一个类，用 @Module 装饰器装饰
/**
 * @Module是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件(控制器、服务器、提供者)组合在一起
 * Nest的模块系统是受Angular启动
 */
@Module({
  controllers: [
    AppController,
    UserController,
    UserController1,
    UserController2,
    CatsController,
  ],
  providers: [
    UserModule,
    { provide: "UserModule1", useClass: UserModule },
    {
      provide: "UserModule2",
      useFactory: () => {
        return new UserModule1("w", 22)
      },
    },
    AppService,
  ],
  imports: [CatsModule, UserM],
})
export class AppModule {}
