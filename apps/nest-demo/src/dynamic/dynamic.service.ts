import { Inject, Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"

@Injectable()
export class DynamicService {
  private readonly envConfig: {
    [key: string]: string
  }

  constructor(@Inject("CONFIG_OPTIONS") options: { folder: string }) {
    const filePath = `${process.env.NODE_ENV || "development"}.env`
    const envFile = path.resolve(__dirname, "../../", options.folder, filePath)
    console.log(envFile)

    this.envConfig = dotenv.parse(fs.readFileSync(envFile))
  }

  get(key: string): string {
    return this.envConfig[key]
  }
}
