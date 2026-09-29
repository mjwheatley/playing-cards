const SUITS = [`Club`, `Heart`, `Spade`, `Diamond`, `None`];

export enum Suit {
  Club,
  Heart,
  Spade,
  Diamond,
  None,
}

export enum DeckType {
  Standard,
  Blackjack,
  None,
}

export interface IPlayingCard {
  deckType?: DeckType;
  cardNumber?: number;
  suitEnum?: Suit;
  suitName?: string;
  cardName?: string;
  fullCardName?: string;
  value?: number;
  symbol?: string;
  isCutCard?: boolean;
  isDownCard?: boolean;
}

export class PlayingCard implements IPlayingCard {
  deckType?: DeckType;
  cardNumber: number;
  suitEnum: Suit;
  suitName: string;
  cardName: string;
  fullCardName: string;
  value: number;
  symbol: string;
  isCutCard?: boolean;
  isDownCard = false;

  /**
   * @param {Number} cardNumber [2-15]
   * @param {Suit} suitEnum {
   *   0: `Club`,
   *   1: `Heart`,
   *   2: `Spade`,
   *   3: `Diamond`,
   *   4: `None`
   * }
   * @param {DeckType?} deckType
   * **/
  constructor({ cardNumber, suitEnum, deckType }: IPlayingCard = {}) {
    const cardNumberRegEx = /(?<!-)\b([2-9]|1[0-5])\b/;

    if (!cardNumberRegEx.test(`${cardNumber}`) || Number.parseInt(`${cardNumber}`) !== Number(cardNumber)) {
      throw new Error(`Invalid cardNumber [${cardNumber}]. Only 2-15 integers allowed.`);
    }

    const suitEnumRegEx = /(?<!-)\b([0-4])\b/;

    if (!suitEnumRegEx.test(`${suitEnum}`) || Number.parseInt(`${suitEnum}`) !== Number(suitEnum)) {
      throw new Error(`Invalid suitEnum [${suitEnum}]. Only 0-4 integers allowed.`);
    }

    this.cardNumber = Number(cardNumber);
    this.suitEnum = Number(suitEnum);
    this.deckType = deckType;
    this.suitName = this.getSuitName();
    this.cardName = this.getCardName();
    this.fullCardName = this.getFullCardName();
    this.value = this.getCardValue();
    this.symbol = this.getCardSymbol();
  }

  /**
   * @return {Number}
   * **/
  getCardNumber(): number {
    return this.cardNumber;
  }

  /**
   * @return {Number}
   * **/
  getSuitEnum(): number {
    return this.suitEnum;
  }

  /**
   * @return {String} `Club` | `Heart` | `Spade` | `Diamond` | `None`
   * **/
  getSuitName(): string {
    return SUITS[this.suitEnum];
  }

  /**
   * @return {String} cardName [2-10] | `Jack` | `Queen` | `King` | `Ace` | `Joker`
   * **/
  getCardName(): string {
    let cardName;

    switch (this.cardNumber) {
      case 11:
        cardName = `Jack`;
        break;
      case 12:
        cardName = `Queen`;
        break;
      case 13:
        cardName = `King`;
        break;
      case 14:
        cardName = `Ace`;
        break;
      case 15:
        cardName = `Joker`;
        break;
      default:
        cardName = `${this.cardNumber}`;
    }

    return cardName;
  }

  /**
   * @return {String} fullCardName // `2 of Clubs`
   * **/
  getFullCardName(): string {
    return `${this.getCardName()} of ${this.getSuitName()}s`;
  }

  /**
   * Return 0 for an Ace so value can dynamically be determined
   * Return -1 for Joker
   * @return {Number} [2-10] | 0 | -1
   * **/
  getCardValue(): number {
    let cardValue = this.cardNumber;

    if (this.deckType === DeckType.Blackjack) {
      switch (this.cardNumber) {
        case 11:
        case 12:
        case 13:
          cardValue = 10;
          break;
        case 14:
          cardValue = 11;
          break;
        case 15:
          cardValue = -1;
          break;
        default:
          cardValue = this.cardNumber;
      }
    }

    return cardValue;
  }

  /**
   * Return the cardName as the cardSymbol for 2-10 and Joker
   * Return the first letter of the cardName for card numbers 11-14
   * @return {String}
   * **/
  getCardSymbol(): string {
    let cardSymbol = this.getCardName();

    if (this.cardNumber >= 11 && this.cardNumber <= 14) {
      cardSymbol = cardSymbol.charAt(0);
    }

    return cardSymbol;
  }

  /**
   * @return {IPlayingCard}
   * **/
  getObject(): IPlayingCard {
    return {
      cardNumber: this.cardNumber,
      suitEnum: this.suitEnum,
      suitName: this.suitName,
      cardName: this.cardName,
      fullCardName: this.fullCardName,
      value: this.value,
      symbol: this.symbol,
    };
  }
}
