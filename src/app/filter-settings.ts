export class FilterSettings {
    selectedDifficulty = {
        easy: true,
        medium: true,
        hard: true
    }

    constructor(selectedDifficulty?: string | string[]) {
        if (selectedDifficulty) {
            this.setSelectedDifficulty(selectedDifficulty)
        }
    }

    // Transform difficulty object into a string
    selectedDifficultyToString() {
        let selectedDifficultyArray = []
        if (this.selectedDifficulty.easy) selectedDifficultyArray.push('easy');
        if (this.selectedDifficulty.medium) selectedDifficultyArray.push('medium');
        if (this.selectedDifficulty.hard) selectedDifficultyArray.push('hard');
        return selectedDifficultyArray.join(',');
    }

    setSelectedDifficulty(selectedDifficulty : string | string[]) : void {
        if (typeof selectedDifficulty == 'string') {
            return this.setSelectedDifficulty(selectedDifficulty.split(','))
        }
        if (Array.isArray(selectedDifficulty)) {
            this.selectedDifficulty.easy = selectedDifficulty.includes('easy')
            this.selectedDifficulty.medium = selectedDifficulty.includes('medium')
            this.selectedDifficulty.hard = selectedDifficulty.includes('hard')
        }
    }
}
