import { Controller, Get, Param } from "@nestjs/common"
import { AppService } from "app.service"

@Controller("cat")
export class CatsController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getCats() {
    return this.appService.getAllCats()
  }

  // add/w
  @Get("/add/:name")
  addCat(@Param("name") name: string) {
    this.appService.addNewCat(name)
    return this.appService.getAllCats()
  }
}
