import { BlackjackHand } from './blackjack-hand.js';

import type { IPlayingCard } from '@mawhea/playing-card/playing-card';

export enum BlackjackDecision {
  HIT = 'HIT',
  STAY = 'STAY',
}

export enum BlackjackWagerType {
  INITIAL = 'INITIAL',
  SPLIT = 'SPLIT',
  INSURANCE = 'INSURANCE',
  PERFECT_PAIRS = 'PERFECT_PAIRS',
  '21_PLUS_3' = '21_PLUS_3',
  TOP_3 = 'TOP_3',
}

export interface BlackjackWager {
  type: BlackjackWagerType;
  amount: number;
}

export enum BlackjackNPCType {
  BUSTER = 'buster',
  RISKY = 'risky',
  WARY = 'wary',
  CAUTIOUS = 'cautious',
}

export interface IBlackjackPlayer {
  isDealer?: boolean;
  isNPC?: boolean;
  isPlaceholder?: boolean;
  name?: string;
  npcType?: BlackjackNPCType;
  cards?: IPlayingCard[];
  wagers?: BlackjackWager[];
  hasStayed?: boolean;
}

export class BlackjackPlayer implements IBlackjackPlayer {
  private _hand = new BlackjackHand();

  public isDealer = false;
  public isNPC = false;
  public isPlaceholder = false;
  public name = ``;
  public npcType: BlackjackNPCType | undefined = undefined;
  public wagers: BlackjackWager[] = [];
  public hasStayed = false;

  get cards(): IPlayingCard[] {
    return this._hand.cards;
  }

  get handValue(): number {
    return this._hand.handValue;
  }

  get handValueIsHard(): boolean {
    return this._hand.handValueIsHard;
  }

  get hasBlackjack(): boolean {
    return this._hand.hasBlackjack;
  }

  get isBusted(): boolean {
    return this._hand.isBusted;
  }

  get hasFirstAce(): boolean {
    return this._hand.hasFirstAce;
  }

  /**
   * Create a blackjack player
   * @param {IBlackjackPlayer} params
   * **/
  constructor({
    isDealer = false,
    isNPC = false,
    isPlaceholder = false,
    name = ``,
    npcType,
    cards = [],
    wagers = [],
    hasStayed = false,
  }: IBlackjackPlayer = {}) {
    this.isDealer = isDealer;
    this.isPlaceholder = isPlaceholder;
    this.isNPC = isNPC;
    this.npcType = npcType;
    this.name = name;
    this.wagers = wagers;
    this.hasStayed = hasStayed;

    if (cards.length > 0) {
      cards.forEach((card) => {
        this.receiveCard({ card });
      });
    }
  }

  resetHand(): void {
    this._hand.clear();
    this.hasStayed = false;
    this.wagers = [];
  }

  receiveCard({ card }: { card: IPlayingCard }): void {
    this._hand.receiveCard({ card });
  }

  /**
   * @return {BlackjackDecision} `HIT` | `STAY`
   * **/
  hitOrStay(): BlackjackDecision {
    let decision = BlackjackDecision.STAY;

    if (this.isDealer) {
      decision = this.handValue < 17 ? BlackjackDecision.HIT : BlackjackDecision.STAY;
    } else {
      switch (this.npcType) {
        case BlackjackNPCType.BUSTER:
          decision = BlackjackDecision.HIT;
          break;
        case BlackjackNPCType.RISKY:
          decision = this.handValue < 21 ? BlackjackDecision.HIT : BlackjackDecision.STAY;
          break;
        case BlackjackNPCType.WARY:
          decision = this.handValue < 14 ? BlackjackDecision.HIT : BlackjackDecision.STAY;
          break;
        case BlackjackNPCType.CAUTIOUS:
          decision = this.handValue < 16 ? BlackjackDecision.HIT : BlackjackDecision.STAY;
          break;
      }
    }

    return decision;
  }
}
