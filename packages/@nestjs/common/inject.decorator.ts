/**
 *  通过provider 收集的 在控制反转的类中的构造函数中可以直接使用。
 *  但是 要注意的一点 如果在构造函数传参去定义的一些接口或者 父类
 *  想用到向下转型的的话 这种匹配的依赖注入模式就会失效，可以通过 @Inject
 *
 * 如果你的类没有扩展另一个类，那么你应该始终更喜欢使用基于构造函数的注入。构造函数明确概述了所需的依赖，
 * 并提供比使用 @Inject 注释的类属性更好的可见性。
 */

import { INJECTED_TOKENS } from './constants'

/**
 *
 * @param token  映射要注入的类关系
 *
 * @deprecated 获取了 需要注入容器中 被Inject 标记的 key
 */
export function Inject(token: string): ParameterDecorator {
	//target类本身 propertyKey方法的名称 parameterIndex参数的索引
	return function (
		target: Function,
		propertyKey: string,
		parameterIndex: number
	) {
		// 先获取当前控制反转的容器 被注入的依赖
		const existingInjectedTokens =
			Reflect.getMetadata(INJECTED_TOKENS, target) ?? []
		//[0,1] [empty,'StringToken']
		existingInjectedTokens[parameterIndex] = token
		//把token数组保存在target的元数据上
		Reflect.defineMetadata(INJECTED_TOKENS, existingInjectedTokens, target)
	}
}
