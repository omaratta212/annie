type Command = {
    trigger: string[] | string,
    callback: () => void
}

export type Config = {
    el: HTMLInputElement;
    maxAlternatives: number;
    interimResults: boolean;
    lang: string;
    continuous: boolean;
    actions: Command[],
    textInput: boolean,
    voiceInput: boolean
}
