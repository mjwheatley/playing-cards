import type { IPlayingCard } from '@mawhea/playing-card/playing-card';

export class BlackjackHand {
  private _cards: IPlayingCard[] = [];

  get cards(): IPlayingCard[] {
    return this._cards;
  }

  get hasFirstAce(): boolean {
    return this._cards.length > 0 && this._cards[0].value === 11;
  }

  get handValue(): number {
    let value = 0;
    let aces = 0;

    for (const card of this._cards) {
      const cardValue = card.value ?? 0;

      if (cardValue === 11) {
        aces++;
        value += 1;
      } else {
        value += cardValue;
      }
    }

    for (let i = 0; i < aces; i++) {
      if (value + 10 <= 21) {
        value += 10;
      }
    }

    return value;
  }

  get handValueIsHard(): boolean {
    let value = 0;
    let aces = 0;

    for (const card of this._cards) {
      const cardValue = card.value ?? 0;

      if (cardValue === 11) {
        aces++;
        value += 1;
      } else {
        value += cardValue;
      }
    }

    let softAces = 0;

    for (let i = 0; i < aces; i++) {
      if (value + 10 <= 21) {
        value += 10;
        softAces++;
      }
    }

    return softAces === 0;
  }

  get isBusted(): boolean {
    return this.handValue > 21;
  }

  get hasBlackjack(): boolean {
    return this._cards.length === 2 && this.handValue === 21;
  }

  receiveCard({ card }: { card: IPlayingCard }): void {
    this._cards.push(card);
  }

  clear(): void {
    this._cards = [];
  }
}
