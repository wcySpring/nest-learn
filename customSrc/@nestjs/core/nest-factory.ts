//   const app = await NestFactory.create(AppModule);

import { Logger } from './logger'
import { NestApplication } from './nest-application'

// 工厂函数要返回 app 实例对象
export class NestFactory {
	static async create(module: any) {
		// 创建Nest 实例
		//启动Nest应用
		Logger.log('Starting Nest application...', 'NestFactory')
		const app = new NestApplication(module)
		return app
	}
}
