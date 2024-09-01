import { Module } from "@nestjs/common"
import { UserModule } from "./src/user/user.module"
import { CatsModule } from "src/cat/cats.module"
import { AppService } from "app.service"
// nest 创建一个新的模块。这个模块是一个类，用 @Module 装饰器装饰
/**
 * @Module是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件(控制器、服务器、提供者)组合在一起
 * Nest的模块系统是受Angular启动
 */
@Module({
  providers: [AppService],
  imports: [UserModule, CatsModule],
})
export class AppModule {}
