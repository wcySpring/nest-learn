/**
 * 实现自定义装饰
 * cxt 作为上下文 可以获取的不单是 http 也可以个是 GraphQL
 */
import { createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator((data: string, ctx: any) => {
	const req = ctx.switchToHttp().getRequest()

	return data ? req.body[data] : req.body
})
