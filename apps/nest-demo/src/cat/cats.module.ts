import { Module } from "@nestjs/common"
import { CatsService } from "./cat.service"

@Module({
  providers: [CatsService], // 注册 CatService 作为提供者
  exports: [CatsService], // 导出 CatService 以便其他模块使用
})
export class CatsModule {}
