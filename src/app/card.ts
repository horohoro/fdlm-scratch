export class Card {
    _id?: string;
    person?: {
        en?: string,
        fr?: string,
        ja?: string,
    };
    wikipedia?: {
        en?: string,
        fr?: string,
        ja?: string,
    };
    player?: number;
    selected?: boolean;
    inputLang?: 'en' | 'fr' | 'ja';
    difficulty?: string;

    copyFrom(cardJSON : any) {
        if (cardJSON._id) this._id = cardJSON._id;
        if (cardJSON.person) {
            this.person = {}
            if (cardJSON.person.en) this.person.en = cardJSON.person.en;
            if (cardJSON.person.fr) this.person.fr = cardJSON.person.fr;
            if (cardJSON.person.ja) this.person.ja = cardJSON.person.ja;
        }
        if (cardJSON.wikipedia) {
            this.wikipedia = {}
            if (cardJSON.wikipedia.en) this.wikipedia.en = cardJSON.wikipedia.en;
            if (cardJSON.wikipedia.fr) this.wikipedia.fr = cardJSON.wikipedia.fr;
            if (cardJSON.wikipedia.ja) this.wikipedia.ja = cardJSON.wikipedia.ja;
        }
        if (cardJSON.player) this.player = cardJSON.player;
        if (cardJSON.selected) this.selected = cardJSON.selected;
        if (cardJSON.inputLang) this.inputLang = cardJSON.inputLang;
        if (cardJSON.difficulty) this.difficulty = cardJSON.difficulty;
    }

    isInputReady() : boolean {
        return !(
            !this.person ||
            !this.person.en ||
            !this.person.fr ||
            !this.person.ja ||
            !this.wikipedia ||
            !this.wikipedia.en ||
            !this.wikipedia.fr ||
            !this.wikipedia.ja ||
            !this.inputLang ||
            !this.difficulty)
    }

    setPerson(person: string, lang?: string) {
        if (!this.person) {
            this.person = {}
        }
        switch (lang) {
            case 'en':
                this.person.en = person;
                break;
            case 'fr':
                this.person.fr = person;
                break;
            case 'ja':
                this.person.ja = person;
                break;
            default:
                this.person.en = person;
        }
    }
    
    getPerson(lang?: string) : string | undefined{
        if (!this.person) {
            return undefined
        }
        switch (lang) {
            case 'en':
                return this.person.en;
            case 'fr':
                return this.person.fr;
            case 'ja':
                return this.person.ja;
            default:
                if (this.person.en) return this.person.en
                if (this.person.fr) return this.person.fr
                if (this.person.ja) return this.person.ja
        }
        return undefined
    }

    setWikipedia(wikipedia: string, lang?: string) {
        if (!this.wikipedia) {
            this.wikipedia = {}
        }
        switch (lang) {
            case 'en':
                this.wikipedia.en = wikipedia;
                break;
            case 'fr':
                this.wikipedia.fr = wikipedia;
                break;
            case 'ja':
                this.wikipedia.ja = wikipedia;
                break;
            default:
                this.wikipedia.en = wikipedia;
        }
    }

    getWikipedia(lang?: string) : string | undefined{
        if (!this.wikipedia) {
            return undefined
        }
        switch (lang) {
            case 'en':
                return this.wikipedia.en;
            case 'fr':
                return this.wikipedia.fr;
            case 'ja':
                return this.wikipedia.ja;
            default:
                if (this.wikipedia.en) return this.wikipedia.en
                if (this.wikipedia.fr) return this.wikipedia.fr
                if (this.wikipedia.ja) return this.wikipedia.ja
        }
        return undefined
    }
}