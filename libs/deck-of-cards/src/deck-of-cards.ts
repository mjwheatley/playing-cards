import { PlayingCard, type IPlayingCard, type DeckType } from '@mawhea/playing-card/playing-card';

export interface IDeckOfCards {
  deckType?: DeckType;
  cards?: IPlayingCard[];
  includesJokers?: boolean;
  hasBeenShuffled?: boolean;
}

export class DeckOfCards implements IDeckOfCards {
  deckType?: DeckType;
  cards: IPlayingCard[] = [];
  includesJokers = true;
  hasBeenShuffled = false;
  /**
   * Create a deck of playing cards containing 54 cards including jokers
   * @param {Boolean?} includesJokers // default true
   * @param {String?} deckType
   * **/
  constructor({ includesJokers = true, deckType }: IDeckOfCards = {}) {
    this.deckType = deckType;
    this.includesJokers = includesJokers;
    for (let suitEnum = 0; suitEnum < 4; suitEnum++) {
      for (let cardNumber = 2; cardNumber < 15; cardNumber++) {
        const playingCard = new PlayingCard({
          cardNumber,
          suitEnum,
          deckType,
        });

        this.cards.push(playingCard.getObject());
      }
    }

    if (includesJokers) {
      this.cards.push(
        new PlayingCard({
          cardNumber: 15,
          suitEnum: 4,
        }).getObject(),
      );
      this.cards.push(
        new PlayingCard({
          cardNumber: 15,
          suitEnum: 4,
        }).getObject(),
      );
    }
  }

  removeJokers(): void {
    if (this.includesJokers && this.cards.length === 54 && !this.hasBeenShuffled) {
      this.includesJokers = !this.includesJokers;
      this.cards.pop();
      this.cards.pop();
    } else if (this.includesJokers && this.hasBeenShuffled) {
      this.includesJokers = !this.includesJokers;
      this.cards = this.cards.filter((card) => {
        return card.cardNumber !== 15;
      });
    }
  }

  /**
   * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   * Randomize array in-place using Durstenfeld shuffle algorithm
   * **/
  shuffle(): void {
    this.hasBeenShuffled = true;
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
