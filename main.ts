import PromptSync from 'prompt-sync';
const input = PromptSync({ sigint: true });


class Main {
    board = new Array<string>(9);

    // Using it as a game loop
    constructor() {
        // this.populateFakeBoard(); // Testing only

        this.populateEmptyBoard();
        this.gameLoop();
    }

    gameLoop(): void {
        for (let i = 0; i < 5; i++) {
            this.readGameBoard();

            this.board[this.handleUserInput()] = 'X';
        }
    }

    populateEmptyBoard(): void { this.board.fill(' '); }

    // testing/developing only
    populateFakeBoard(): void {
        const randomPossibilities = ['X', 'O'];

        for (let i = 0; i < this.board.length; i++) {

            const randomNumber = Math.floor(Math.random() * randomPossibilities.length);
            this.board[i] = randomPossibilities[randomNumber];
        }
    }

    readGameBoard(): void {
        let line = '';

        for (let i = 0; i < this.board.length; i++) {
            line += this.board[i] + ' | ';

            if ((i + 1) % 3 === 0) {
                /*
                    * This crazy logic of the loop makes a lot of sense
                    * It's easy to understand:
                    * since arrays are index 0, we need to start our
                    * i variable as value 0. But in order to populate
                    * all three indexes of each line in only one loop
                    * the third index ( 2 ) must be somehow divisible by three
                    * but 2 isn't directly divisible by 3. Unless summed with 1
                    * 
                    * This whole logic could've been simplified by using two loops
                    * But what's the fun of that ? And also, it would've been slower
                */
                console.log(line);
                line = '';
            }
        }
    }

    /*
        * Handle user input gets the user input
        * handle's it ( sanitize it ), and return the sanitized input
        * which is the position the user want's to put a 'X' on the board
        * 
        * It also makes the user give the right input
    */
    handleUserInput(): number {
        const userInput = input('[1 ~ 9]: ');
        const validation = validateUserInput(userInput);

        if (validation.isValidated) { return validation.sanitizedUserInput; }
        else { return handleIncorrectUserInput(); }

        function handleIncorrectUserInput(): number {
            while (true) {
                console.log('Incorrect Input! It must be a number, with 1 ~ 9 index! Try again.');
                const newUserInput = input('[1 ~ 9]: ');

                const newValidation = validateUserInput(newUserInput);
                if (newValidation.isValidated) return newValidation.sanitizedUserInput;
            }
        }

        function validateUserInput(userInput: string): { isValidated: boolean, sanitizedUserInput?: number; } {
            /*
                * If the user's input is correct, it returns an object
                    * { isValidated: true, sanitizedUserInput }
                * otherwise, it returns { isValidated: false }
            */

            if (/^\d+$/.test(userInput)) {
                const sanitizedUserInput: number = (+userInput) - 1;
                /*
                    * Lots of things to cover
                    *
                    * +userInput -> parsing a string to number
                    * of course the user has to type a number for the index
                    * of the position in the board, they want to play in
                    * but that's not the job of the getting input part
                    * that's the job of the validation part
                    * 
                    * - 1 -> the array is index 0. But in the real game
                    * the index is 1 ~ 9, not 0 ~ 8. In order to fix that
                    * we can simply remove 1 to the userInput, transforming
                    * it 1 ~ 9 index. ( you type 1 ( the first index ), but the game 
                    * understands it as 0 ( the first index ))
                */

                if (sanitizedUserInput >= 0 && sanitizedUserInput <= 8) {
                    return { isValidated: true, sanitizedUserInput };
                }
            }

            return { isValidated: false };
        }
    }

    isPositionAvailable(position: number): boolean {
        if (this.board[position] !== ' ') return false;

        return true;
    }
}

const main = new Main();

// TODO: At the start, ask if it's a multiplayer game, or a sole game
// TODO: If it's a solo game, display an input asking for the difficulty
// TODO: Work on the solo game functionality
// TODO: Work on the multiplayer game functionality ( x and o )
// TODO: To implement single player and multi player functionality, create a SinglePlayer class, and extend it from the main class, and only do the SinglePlayer code functionality
