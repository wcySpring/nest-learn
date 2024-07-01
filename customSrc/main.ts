import { NestFactory } from './@nestjs/core'
import { AppModule } from './app.module'

// 定义一个异步函数，用于创建并且启动 Nest 应用
async function bootstrap() {
	// 使用 NestFactory 创建一个 Nest 应用实例 并传入根模块 AppModule
	// 在底层，NestFactory.create() 方法使用了一个内部的 HTTP 服务器（Express 或 Fastify）来处理传入的请求
	const app = await NestFactory.create(AppModule)

	// 使用 app.listen 方法监听 3000 端口
	await app.listen(3000)
}

bootstrap()
