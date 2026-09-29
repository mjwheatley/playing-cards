import { DeckOfCards } from '@mawhea/deck-of-cards/deck-of-cards';
import { DeckType, type IPlayingCard } from '@mawhea/playing-card/playing-card';

export interface IBlackjackShoe {
  numberOfDecks?: number;
  cards?: IPlayingCard[];
  cutNumber?: number;
}

export class BlackjackShoe implements IBlackjackShoe {
  numberOfDecks = 6;
  cards: IPlayingCard[] = [];
  cutNumber: number;

  /**
   * Create a blackjack shoe containing the specified number of playing card decks
   * @param {Number?} numberOfDecks
   * **/
  constructor({ numberOfDecks = 6 }: IBlackjackShoe = {}) {
    this.numberOfDecks = numberOfDecks;
    this.cutNumber = this.generateCutNumber();
    for (let i = 0; i < numberOfDecks; i++) {
      this.cards.push(
        ...new DeckOfCards({
          includesJokers: false,
          deckType: DeckType.Blackjack,
        }).cards,
      );
    }
  }

  /**
   * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   * Randomize array in-place using Durstenfeld shuffle algorithm
   * **/
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Randomly generate a cutNumber, minimum 1/2 deck, max 2 decks
   * Returns a random integer from 26 to 104
   * @return {Number} cutNumber
   * **/
  generateCutNumber(): number {
    // total number of playing cards in 2 decks = 104;
    // half deck of cards = 26
    // do not exceed 2 decks of cards = 104 - 26
    return Math.floor(Math.random() * (104 - 26)) + 26;
  }

  /**
   * Cut the shoe of cards randomly, minimum 1/2 deck, max 2 decks
   * @param {Number?} cutNumber
   * **/
  cut({ cutNumber }: { cutNumber?: number } = {}): void {
    cutNumber ??= this.generateCutNumber();

    if (cutNumber >= 26 && cutNumber <= 104) {
      this.cutNumber = cutNumber;
    } else {
      throw new Error(`cutNumber[${cutNumber}] must be between 26 and 104`);
    }

    this.cards[this.cards.length - this.cutNumber].isCutCard = true;
  }
}
