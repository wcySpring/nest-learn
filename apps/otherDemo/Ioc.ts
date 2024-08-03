/**
 * 依赖注入将 对象创建的交给容器，让容器管理生命周期减少代码之间的耦合。
 * 相比传统程序直接控制所依赖的对象的创建和管理一种设计原则上的转变
 *
 * nestjs 装饰器的设计思想来做，因此要收集（注册） 和 解析（配对） 这样就可以
 * 对匹配的任意更换零件 来创建
 */

// 先创建 一些类，这些类可能是其他的 类的容器 也可能是其他类需要匹配的 注入对象
// 下面案例中 car 就是引擎的 控制反转容器， 引擎是注入car 中的对象

// 导入 reflect-metadata 库以启用元数据反射
import 'reflect-metadata'
// 定义一个 Injectable 装饰器，用于标记可注入的类
function Injectable(): ClassDecorator {
	return (target: Function) => {
		// 这个装饰器不需要执行任何操作，仅用于元数据生成
	}
}
// 使用 Injectable 装饰器标记 Engine 类为可注入
@Injectable()
class Engine {
	// 定义 start 方法，模拟引擎启动
	start() {
		console.log('Engine started')
	}
}

// 使用 Injectable 装饰器标记 Car 类为可注入
@Injectable()
class Car {
	// 通过构造函数注入 Engine 实例
	constructor(private engine: Engine) {}
	// 定义 drive 方法，调用引擎的 start 方法并打印信息
	drive() {
		this.engine.start()
		console.log('Car is driving')
	}
}

/**
`DIContainer`（Dependency Injection Container，依赖注入容器）是一个设计模式中的组件，主要用于管理和注入应用程序中的依赖关系。依赖注入是一种编程技术，用于实现控制反转（IoC，Inversion of Control），从而使代码更加模块化、可测试和可维护。

### DIContainer 的主要功能

1. **依赖管理**：DIContainer 负责创建和管理对象及其依赖关系。它通常包含一个注册表，记录了哪些类需要哪些依赖。

2. **对象实例化**：当应用程序需要一个对象时，DIContainer 会负责实例化该对象及其所有依赖。这通常通过反射或其他元编程技术实现。

3. **依赖注入**：DIContainer 将依赖注入到对象中。注入的方式可以是构造函数注入、属性注入或方法注入。

4. **生命周期管理**：DIContainer 可以管理对象的生命周期，例如单例（Singleton）、每次请求新实例（Transient）或作用域实例（Scoped）。

### 使用 DIContainer 的好处

1. **解耦**：通过将依赖关系的管理交给容器，代码中的各个组件可以更加独立，减少了直接的依赖关系。

2. **可测试性**：依赖注入使得单元测试更加容易，因为可以在测试时轻松替换依赖的实现。

3. **可维护性**：由于依赖关系清晰且集中管理，代码更容易理解和维护。

4. **灵活性**：可以在运行时动态地改变依赖关系的实现，从而提高系统的灵活性和可扩展性。


 */
class DIContainer {
	// 容器中的注册表 Map
	private services = new Map<string, any>()

	// 用来注册那些 是需要后期依赖注入的类 注册到注册表中
	register<T>(name: string, implementation: new (...args: any[]) => T) {
		this.services.set(name, implementation)
	}

	//  对象实例化 解析（配对）解析服务的方法，根据名称返回服务的实例
	resolve<T>(name: string) {
		// 获取需要被实例的对象
		const implementation = this.services.get(name)
		if (!implementation) {
			throw new Error(`Service ${name} not found`)
		}

		// 获取构造函数中的 参数类型， 因为这里的依赖注入其实就是通过构造函数注入
		// 因此 只要获取 要不被注入的构造函数 并且帮其创建好 对象 注入到 控制反转容器
		// Reflect.getMetadata('design:paramtypes', constructor) 可以获取构造函数上的参数类型

		const dependencies =
			Reflect.getMetadata('design:paramtypes', implementation) || []

		console.log(dependencies) // [ [class Engine] ]

		// 获取类型 其实需要帮助实例化 这里就是 要在调用 resolve,
		const injections = dependencies.map((dep: any) => this.resolve(dep.name))

		// 将依赖通过构造函数注入
		return new implementation(...injections)
	}
}

// 开始去注册 需要到时候被依赖注入的 类

// 创建依赖注入容器的实例
const container = new DIContainer()
// 注册 Engine 和 Car 服务
container.register('Engine', Engine)
container.register('Car', Car)

// 解析 Car 服务并调用其 drive 方法
const car = container.resolve<Car>('Car')
car.drive()

// 上面的案例有一个特点注入的只能是 需要提前 Injectable 修饰的
// 如果有属于自己构造函数传参 需要改动  依赖注入容器
//定义一个依赖注入容器类
class DIContainer1 {
	//定义一个存储所有的服务的Map对象
	private services = new Map<string, any>()
	//注册服务的方法，把服务的名称和实现类保存到Map中
	register<T>(name: string, Service: any) {
		this.services.set(name, Service)
	}
	//解析服务的方法，根据名称返回服务的实例
	resolve<T>(name: string) {
		//获取服务的实现类
		const Service = this.services.get(name)
		if (Service instanceof Function) {
			//可能是一个类
			//获取实现类的构造函数参数的类型数组
			const dependencies =
				Reflect.getMetadata('design:paramtypes', Service) ?? [] //[Engine]
			//递归解析所有的依赖项
			const injections = dependencies.map((dependency) =>
				this.resolve(dependency.name)
			)
			//创建并返回实现类的实例
			return new Service(...injections)
		} else if (Service.useFactory) {
			//也可是注册的是一个工厂函数
			const { inject } = Service
			return Service.useFactory(...inject)
		} else if (Service.useValue) {
			//也可能就是一直给定的值
			return Service.useValue
		}
	}
}

class Oil {
	constructor(private num: number) {}
	start() {
		console.log(`start oil`, this.num)
	}
}
@Injectable()
class Engine1 {
	constructor(private oil: Oil, age: number) {}
	start() {
		this.oil.start()
		console.log(`Engine started`)
	}
}
@Injectable()
class Car1 {
	constructor(private engine: Engine) {}
	drive() {
		this.engine.start()
		console.log('Car is runing')
	}
}

//创建一个依赖注入的容器实例
const container1 = new DIContainer1()
container1.register<Oil>('Oil', {
	provide: 'Oil',
	inject: [100],
	useFactory: (number) => {
		return new Oil(number)
	},
})
container1.register<Engine>('Engine', {
	provide: 'Engine',
	useValue: new Engine1(new Oil(200), 18),
})
container.register<Car1>('Car1', Car1)
const car1 = container.resolve<Car1>('Car1')
car1.drive()
