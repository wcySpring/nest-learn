// controller 用来处理请求
import { AppController } from './app.controller'

import { Module } from '@nestjs/common'

// nest 创建一个新的模块。这个模块是一个类，用 @Module 装饰器装饰
/**
 * @Module是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件(控制器、服务器、提供者)组合在一起
 * Nest的模块系统是受Angular启动
 */
@Module({
	controllers: [AppController],
})
export class AppModule {}
