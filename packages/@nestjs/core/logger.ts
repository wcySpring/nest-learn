import clc from 'cli-color'

export class Logger {
	// 定义一个时间戳记录 往后 触发的模块都要从第一次这次开始计时 所以是固定的
	private static lastLogTime = Date.now()

	// 定义一个用来打印日志的工具方法
	static log(message: string, context: string) {
		// 获取此时 时间戳
		const timestamp = new Date().toLocaleString()
		// 获取进程id
		const pid = process.pid
		const currentTime = Date.now()
		// 获取时间即时
		const timeDiff = currentTime - Logger.lastLogTime
		console.log(
			`[${clc.green('Nest')}] ${clc.green(pid.toString())}  - ${clc.yellow(
				timestamp
			)}     ${clc.green('LOG')} [${clc.yellow(context)}] ${clc.green(
				message
			)} ${clc.white('+')}${clc.green(timeDiff)}${clc.white('ms')}`
		)
		this.lastLogTime = currentTime
	}
}
