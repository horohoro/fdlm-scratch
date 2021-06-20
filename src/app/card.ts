export class Card {
    _id!: String;
    person!: {
        en?: String,
        fr?: String,
        ja?: String,
    };
    wikipedia?: {
        en?: String,
        fr?: String,
        ja?: String,
    }
    player?: Number;
    selected?: Boolean;
    inputLang?: String;
    difficulty?: String;

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
}