import 'reflect-metadata'

export function Get(path: string = ''): MethodDecorator {
	/**
	 * target 类原型 AppController.prototype
	 * propertyKey方法键名 index
	 * descriptor index方法的属性描述器
	 */
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log(descriptor.value, 22);

    /**
     * Reflect.defineMetadata("path", path, target, propertyKey);
     * const a = new A
     * 取写法 console.log(Reflect.getMetadata("path", a, "getName"));
     * 但是这里 target 用的function 所以即使在不同类中重名，但是他们指向不同
     * 相当于下面的写法比上面的更简单上面用 property+方法名做映射 等于 内存指向这种更简洁
     *
     * descriptor.value 的作用：descriptor.value 是指向该方法实现的引用。即使方法名相同，不同类中的方法会拥有不同的 descriptor.value，因为它们的实现是不同的函数对象。
     * 例如，如果类 A 和类 B 都有一个方法 index，即使它们的方法名相同，但 A.prototype.index 和 B.prototype.index 是两个不同的函数对象，因此 descriptor.value 也会不同。
     * 因为每个类中的方法即使名字相同，但它们在内存中的指向不同，这就保证了即使在不同的类中有相同的方法名，它们的元数据也不会冲突。这是因为元数据是存储在具体的函数对象上的，而不是单纯地依赖方法名
     * */
    //给descriptor.value，也就是index函数添加元数据，path=path Get 收集的地址
    Reflect.defineMetadata("path", path, descriptor.value);
    //descriptor.value.path = path;
    //给descriptor.value，也就是index函数添加元数据，method=GET
    //descriptor.value.method = 'GET'

    Reflect.defineMetadata("method", "GET", descriptor.value);
  }
}

/**
 * Post 默认返回值是 201
 * @param path
 * @returns
 */
export function Post(path: string = ''): MethodDecorator {
	/**
	 * target 类原型 AppController.prototype
	 * propertyKey方法键名 index
	 * descriptor index方法的属性描述器
	 */
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		//给descriptor.value，也就是index函数添加元数据，path=path Post 收集的地址
		Reflect.defineMetadata('path', path, descriptor.value)
		//descriptor.value.path = path;
		//给descriptor.value，也就是index函数添加元数据，method=POST
		Reflect.defineMetadata('method', 'POST', descriptor.value)
		//descriptor.value.method = 'POST'
	}
}

/**
 * @Redirect() 有两个参数，url 和 statusCode，两者都是可选的。如果省略，statusCode 的默认值为 302 (Found)。
 * @param redirectPath 重定向地址
 * @param statusCode 默认302
 * @returns
 */
export function Redirect(
	redirectPath: string,
	statusCode: 301 | 302 = 302
): MethodDecorator {
	/**
	 * target 类原型 AppController.prototype
	 * propertyKey方法键名 index
	 * descriptor index方法的属性描述器
	 */
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata('redirectUrl', redirectPath, descriptor.value)
		Reflect.defineMetadata('redirectStatusCode', statusCode, descriptor.value)
	}
}

/**
 * 响应状态码装饰器
 * @param statusCode
 * @returns
 */
export function HttpCode(statusCode: number = 200): MethodDecorator {
	return function (target, key, descriptor) {
		Reflect.defineMetadata('statusCode', statusCode, descriptor.value)
	}
}

/**
 *  @Header() 装饰器或库特定的响应对象（并直接调用 res.header()）。
 */
export function Header(name: string, value: string): MethodDecorator {
	return function (target, key, descriptor) {
		// 将数据存到数组中 因为响应头可以设置多个
		const existingHeaders =
			Reflect.getMetadata('headers', descriptor.value) || []
		existingHeaders.push({ name, value })
		Reflect.defineMetadata('headers', existingHeaders, descriptor.value)
	}
}
