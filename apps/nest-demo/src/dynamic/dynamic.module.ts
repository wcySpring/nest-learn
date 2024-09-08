// import { Module } from '@nestjs/common';
// import { DynamicService } from './dynamic.service';

// @Module({
//   providers: [DynamicService]
// })
// export class DynamicModule {}

// 动态模块
import { DynamicModule, Module } from "@nestjs/common"
import { DynamicService } from "./dynamic.service"

export interface ConfigModuleOptions {
  folder: string
}

@Module({})
export class DynamicConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      module: DynamicConfigModule,
      providers: [
        {
          provide: "CONFIG_OPTIONS",
          useValue: options,
        },
        DynamicService,
      ],
      exports: [DynamicService],
    }
  }
}
