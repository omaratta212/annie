import {Config} from "./types/Config";

export class Annie {
    private recognition: SpeechRecognition;
    private phrases: string[] = []
    private phrasesMap: Map<string, any>
    private el: HTMLInputElement

    constructor(
        config: Config,
        // @ts-ignore
        recognition: SpeechRecognition = SpeechRecognition ? new SpeechRecognition() : new webkitSpeechRecognition(),
        // @ts-ignore
        speechRecognitionList: SpeechGrammarList = SpeechGrammarList ? new SpeechGrammarList() : new webkitSpeechGrammarList(),
    ) {
        this.el = config.el
        /* Recognition options */
        this.recognition = recognition
        this.recognition.continuous = config.continuous ?? false
        this.recognition.lang = config.lang ?? 'en-US'
        this.recognition.interimResults = config.interimResults ?? false
        this.recognition.maxAlternatives = config.maxAlternatives ?? 1


        /* Bind the listen function to the class */
        this.toggleListening = this.toggleListening.bind(this)
        this.testSpeech = this.testSpeech.bind(this)

        /* Set the phrases & their function map */
        this.phrases = this.getPhrasesString(config)
        speechRecognitionList.addFromString(this.getGrammarList(this.phrases))
        this.recognition.grammars = speechRecognitionList
        this.phrasesMap = this.getPhrasesMap(config)

        this.recognition.onresult = this.testSpeech
    }

    toggleListening() {
        try {
            this.recognition.start()
        } catch {
            this.recognition.stop()
        }
    }

    getPhrasesString(config: Config): string[] {
        return config.actions.map((action) => action.trigger).flat()
    }

    getGrammarList(list: string[]){
        return '#JSGF V1.0; grammar phrase; public <phrase> = ' + list.join(' ') +';'
    }

    getPhrasesMap(config: Config): Map<string, any> {
        const map = new Map()
        for (const action of config.actions) {
            if (typeof action.trigger === "string") {
                map.set(action.trigger, action.callback)
            }
            if (Array.isArray(action.trigger)) {
                for (const trigger of action.trigger) {
                    map.set(trigger, action.callback)
                }
            }
        }
        return map
    }

    testSpeech(event: SpeechRecognitionEvent) {
        const result = event.results?.[0]?.[0]?.transcript
        if(result && this.phrasesMap.has(result)) {
            this.el.value = result
            this.phrasesMap.get(result)()
        }
    }
}
