// 导入 reflect-metadata 库以启用元数据反射
import 'reflect-metadata'

// 定义一个 Injectable 装饰器，用于标记可注入的类
function Injectable(): ClassDecorator {
	return (target: Function) => {
		// 这个装饰器不需要执行任何操作，仅用于元数据生成
	}
}

// 定义 Engine 接口
interface EngineInterface {
	start(): void
}

// 使用 Injectable 装饰器标记 Engine 类为可注入
@Injectable()
class V8Engine implements EngineInterface {
	start() {
		console.log('V8 Engine started')
	}
}

@Injectable()
class ElectricEngine implements EngineInterface {
	start() {
		console.log('Electric Engine started')
	}
}

// 使用 Injectable 装饰器标记 Car 类为可注入
@Injectable()
class Car {
	// 通过构造函数注入 Engine 实例
	constructor(private engine: ElectricEngine) {}
	// 定义 drive 方法，调用引擎的 start 方法并打印信息
	drive() {
		this.engine.start()
		console.log('Car is driving')
	}
}

// 定义一个依赖注入容器类 DIContainer
class DIContainer {
	// 存储服务的 Map 对象
	private services = new Map<string, any>()
	// 注册服务的方法，将服务的名称和实现类保存到 Map 中
	register<T>(name: string, implementation: new (...args: any[]) => T): void {
		this.services.set(name, implementation)
	}
	// 解析服务的方法，根据名称返回服务的实例
	resolve<T>(name: string): T {
		// 获取服务的实现类
		const implementation = this.services.get(name)
		if (!implementation) {
			throw new Error(`Service ${name} not found`)
		}
		// 获取实现类的构造函数参数类型
		const dependencies =
			Reflect.getMetadata('design:paramtypes', implementation) || []
		// 递归解析所有依赖项
		const injections = dependencies.map((dep: any) => this.resolve(dep.name))
		console.log(injections)

		// 创建并返回实现类的实例
		return new implementation(...injections)
	}
}

// 创建依赖注入容器的实例
const container = new DIContainer()
// 注册 Engine 和 Car 服务
container.register('Engine', V8Engine) // 或者 container.register('Engine', ElectricEngine);
container.register('Car', Car)
// 解析 Car 服务并调用其 drive 方法
const car = container.resolve<Car>('Car')
car.drive()
