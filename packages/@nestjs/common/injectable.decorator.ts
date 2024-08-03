/**
 * 想让当前类可以 被依赖注入需要使用@Injectable() 装饰器。@Injectable() 装饰器附加元数据，
 * 该元数据声明 CatsService 是可由 Nest IoC 容器管理的类
 */
export function Injectable(): ClassDecorator {
	return function (target) {
		//给类的定义添加一个元数据，数据名称为injectable,值为true
		Reflect.defineMetadata('injectable', true, target)
	}
}
