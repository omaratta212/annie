type Command = {
    trigger: string[] | string,
    callback: () => void
}

export type Config = {
    actions: Command[],
    textInput: boolean,
    voiceInput: boolean
}
