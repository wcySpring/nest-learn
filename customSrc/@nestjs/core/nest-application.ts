import express, {
	Express,
	Request as ExpressRequest,
	Response as ExpressResponse,
	NextFunction,
} from 'express'

import 'reflect-metadata'

//    const app = new NestApplication(module);
export class NestApplication {
	// 实例化一个express
	private readonly app: Express = express()

	protected readonly module
	// 注册 module
	constructor(module) {
		this.module = module
	}
	// constructor(protected readonly module) {}

	/**
	 * 根据 reflect-metadata 元数据 收集相应依赖重新
	 * 拼装成express 展示格式
	 * */
	init() {
		// 获取收集所有的 controllers 这里使用 reflect 获取收集的 class 实体
		const controllers = Reflect.getMetadata('controllers', this.module) || []
		console.log(controllers)
		// 循环收集 Module 中的 controllers 层 进行express 拼装
		for (const Controller of controllers) {
			//创建每个控制器的实例
			const controller = new Controller()
			// 在从每个控制器上获取绑定的 路径前缀 获取控制器的路径前缀
			const prefix = Reflect.getMetadata('prefix', Controller) || '/'
		}
	}

	// 启动Http 服务
	async listen(port: Number) {
		await this.init()

		this.app.listen(port, () => {
			// 启动服务
			console.log(`Application is running on http://localhost:${port}`)
		})
	}
}
