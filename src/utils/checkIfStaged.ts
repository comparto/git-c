import { exec } from 'child_process'
import kleur from 'kleur'

/**
 * Determines wether or not files are staged.
 */
export const checkIfStaged = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec('git --no-pager diff --cached --quiet --exit-code', error => {
      if (error) {
        resolve('')
      }
      reject(
        new Error(
          `No files staged! \n\n${kleur.blue(
            'Tip: You can use "git-c c -p --add" to replicate git -am'
          )}`
        )
      )
    })
  })
}
