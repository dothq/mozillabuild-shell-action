import * as core from '@actions/core'
import execa from 'execa'
import {existsSync, writeFileSync} from 'fs'
import {tmpdir} from 'os'
import {resolve} from 'path'
import { dispatch } from './dispatch'

async function run(): Promise<void> {
  try {
    if (process.platform !== 'win32')
      core.setFailed('This can only be ran on Windows.')

    const command: string = core.getInput('run')

    core.info(`Executing "${command}"...`)

    const mozillaBuildDir = resolve('C:\\mozilla-build')

    if (existsSync(mozillaBuildDir)) {
      const shell = resolve(mozillaBuildDir, 'start-shell.bat')

      const tmp = resolve(tmpdir())
      const scriptPath = resolve(
        tmp,
        Math.floor(Math.random() * 16777215).toString(16)
      )

      writeFileSync(scriptPath, command)

      core.info(scriptPath)
      core.info(command)

      await dispatch(shell, [scriptPath]);
    } else {
      core.setFailed(`${mozillaBuildDir} does not exist.`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
