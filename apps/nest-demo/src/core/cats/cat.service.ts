import { Injectable } from "@nestjs/common"

@Injectable()
export class CatsService {
  private cats: string[] = []

  addCat(cat: string) {
    this.cats.push(cat)
  }

  getCats(): string[] {
    return this.cats
  }
}
