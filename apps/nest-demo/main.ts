// 导入 NestFactory 模块，它用于创建Nest 应用实例
import { NestFactory } from '@nestjs/core'

// 导入跟模块
import { AppModule } from './app.module'
// 定义一个异步函数，用于创建并且启动 Nest 应用
async function bootstrap() {

	// 使用 NestFactory 创建一个 Nest 应用实例 并传入根模块 AppModule
	// 在底层，NestFactory.create() 方法使用了一个内部的 HTTP 服务器（Express 或 Fastify）来处理传入的请求
	const app = await NestFactory.create(AppModule)
	// NestFactory 它提供了一些静态方法来建立和配置整个应用程序
	// // 设置全局路由前缀
	// app.setGlobalPrefix("api");

	// // 启用 CORS
	// app.enableCors();

	// 使用 app.listen 方法监听 3000 端口
	await app.listen(3000)
}

bootstrap()
