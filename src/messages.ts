interface Flags {
  passThrough: string
  subject: string
  scope: string
  body: string
  breaking: string
  issue: string
  type: string
}

interface Messages {
  examples: string[]
  description: string
  flags: Flags
}

const skipQuestionMessage = (question: string) =>
  `skip "${question}" question and provide your own "${question}" message`

export const messages: Messages = {
  examples: [
    'git-c',
    'git-c commit',
    'git-c c',
    'git-c c -p --amend',
    'git-c commit -m "added cool new feature" -t "feat" -s "amazing"'
  ],
  description: 'interactive conventional commits cli (default command)',
  flags: {
    get body(): string {
      return skipQuestionMessage('body')
    },
    get breaking(): string {
      return skipQuestionMessage('breaking')
    },
    get issue(): string {
      return skipQuestionMessage('issue')
    },
    passThrough: 'subsequent command line args passed through to "git"',
    get scope(): string {
      return skipQuestionMessage('scope')
    },
    get subject(): string {
      return skipQuestionMessage('subject')
    },
    get type(): string {
      return skipQuestionMessage('type')
    }
  }
}
