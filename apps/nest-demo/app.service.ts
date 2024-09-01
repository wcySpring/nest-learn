import { Injectable } from "@nestjs/common"
import { CatsService } from "./src/cat/cat.service"

@Injectable()
export class AppService {
  constructor(private readonly catService: CatsService) {}

  addNewCat(cat: string) {
    this.catService.addCat(cat)
  }

  getAllCats(): string[] {
    return this.catService.getCats()
  }
}
