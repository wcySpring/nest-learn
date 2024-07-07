import 'reflect-metadata'

export function Get(path: string = ""): MethodDecorator {
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
     * */
    //给descriptor.value，也就是index函数添加元数据，path=path Get 收集的地址
    Reflect.defineMetadata("path", path, descriptor.value);
    //descriptor.value.path = path;
    //给descriptor.value，也就是index函数添加元数据，method=GET
    //descriptor.value.method = 'GET'

    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}

export function Post(path: string = ""): MethodDecorator {
  /**
   * target 类原型 AppController.prototype
   * propertyKey方法键名 index
   * descriptor index方法的属性描述器
   */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    //给descriptor.value，也就是index函数添加元数据，path=path Post 收集的地址
    Reflect.defineMetadata("path", path, descriptor.value);
    //descriptor.value.path = path;
    //给descriptor.value，也就是index函数添加元数据，method=POST
    Reflect.defineMetadata("method", "POST", descriptor.value);
    //descriptor.value.method = 'POST'
  };
}