import { BlackjackPlayer } from '@mawhea/blackjack-player/blackjack-player';
import { BlackjackShoe } from '@mawhea/blackjack-shoe/blackjack-shoe';
import { v4 as uuidv4 } from 'uuid';

import type { IBlackjackPlayer } from '@mawhea/blackjack-player/blackjack-player';
import type { IPlayingCard } from '@mawhea/playing-card/playing-card';

export interface IBlackjackTable {
  id?: string;
  dealer?: IBlackjackPlayer;
  seats?: IBlackjackPlayer[];
  shoe?: BlackjackShoe;
  isAtLeastOnePlayer?: boolean;
  isCutCardOut?: boolean;
  muckedCards?: IPlayingCard[];
  activeSeat?: number;
}

/**
 * A blackjack table has seats for 7 players, 1 blackjack shoe, and 1 dealer
 * **/
export class BlackjackTable implements IBlackjackTable {
  id: string;
  dealer: BlackjackPlayer;
  seats: BlackjackPlayer[] = [];
  shoe: BlackjackShoe = new BlackjackShoe();
  isAtLeastOnePlayer: boolean;
  isCutCardOut: boolean;
  muckedCards: IPlayingCard[];
  activeSeat = 0;

  /**
   * Create a blackjack table
   * **/
  constructor() {
    this.id = uuidv4();
    this.dealer = new BlackjackPlayer({
      isDealer: true,
      name: `Dealer1`,
    });
    this.seats = [];
    for (let i = 0; i < 7; i++) {
      this.seats.push(new BlackjackPlayer({ isPlaceholder: true }));
    }
    this.isAtLeastOnePlayer = false;
    this.isCutCardOut = false;
    this.muckedCards = [];
    this.createShoe();
  }

  createShoe(): void {
    this.shoe = new BlackjackShoe();
    this.shoe.shuffle();
    this.shoe.cut();
    this.isCutCardOut = false;
    this.muckedCards = [];
  }

  /**
   * @param {BlackjackPlayer} player
   * @param {Number} seatIndex [0-6]
   * **/
  addPlayerToTable({ player, seatIndex }: { player: BlackjackPlayer; seatIndex: number }): void {
    const seatIndexRegEx = /(?<!-)\b([0-6])\b/;

    if (!seatIndexRegEx.test(`${seatIndex}`) || Number.parseInt(`${seatIndex}`) !== seatIndex) {
      throw new Error(`Invalid seatIndex [${seatIndex}]. Only 0-6 integers allowed.`);
    }

    this.seats[seatIndex] = player;
    this.isAtLeastOnePlayer = true;
  }

  /**
   * @param {Number} seatIndex [0-6]
   * **/
  removePlayerFromTable({ seatIndex }: { seatIndex: number }): void {
    const seatIndexRegEx = /(?<!-)\b([0-6])\b/;

    if (!seatIndexRegEx.test(`${seatIndex}`) || Number.parseInt(`${seatIndex}`) !== seatIndex) {
      throw new Error(`Invalid seatIndex [${seatIndex}]. Only 0-6 integers allowed.`);
    }

    this.seats[seatIndex] = new BlackjackPlayer({ isPlaceholder: true });
    let isAtLeastOnePlayer = false;

    for (const player of this.seats) {
      if (!player.isPlaceholder) {
        isAtLeastOnePlayer = true;
      }
    }
    this.isAtLeastOnePlayer = isAtLeastOnePlayer;
  }

  buyIn(): void {
    /* empty */
  }

  /**
   * @param {BlackjackPlayer} player
   * @param {Boolean?} isDownCard
   * **/
  dealCardToPlayer({ player, isDownCard = false }: { player: BlackjackPlayer; isDownCard?: boolean }): void {
    const card = this.shoe.cards.shift();

    if (card) {
      card.isDownCard = isDownCard;
      this.checkForCutCard({ card });
      player.receiveCard({ card });
    }
  }

  /**
   * Deal 2 cards to all players including the dealer
   * Deal one up card to each player, followed by a down card to the dealer.
   * Then deal a second up card to each player, followed by the dealer's up card.
   * **/
  async startRound(): Promise<void> {
    if (!this.isAtLeastOnePlayer) {
      throw new Error(`Unable to start round without any players`);
    } else {
      /** Deal 1st card to all players **/
      for (const player of this.seats) {
        if (!player.isPlaceholder) {
          player.resetHand();
          this.dealCardToPlayer({ player });
        }
      }

      /** Deal down card to dealer **/
      this.dealer.resetHand();
      this.dealCardToPlayer({
        player: this.dealer,
        isDownCard: true,
      });

      /** Deal 2nd card to all players **/
      for (const player of this.seats) {
        if (!player.isPlaceholder) {
          this.dealCardToPlayer({ player });
        }
      }

      /** Deal up card to dealer **/
      this.dealCardToPlayer({ player: this.dealer });
    }

    await this.postStartRound();
    this.startPlayersChoice();
  }

  startPlayersChoice(): void {
    let activeSeat = 0;

    for (let i = 0; i < this.seats.length; i++) {
      const player = this.seats[i];

      if (!player.isPlaceholder && !player.hasBlackjack && !player.isBusted && !player.hasStayed) {
        activeSeat = i;
        break;
      }
    }
    this.activeSeat = activeSeat;
    this.checkActiveSeatAI();
  }

  advancePlayersChoice(): void {
    let activeSeat = -1;

    for (let i = this.activeSeat + 1; i < this.seats.length; i++) {
      const player = this.seats[i];

      if (!player.isPlaceholder && !player.hasBlackjack && !player.isBusted && !player.hasStayed) {
        activeSeat = i;
        break;
      }
    }
    this.activeSeat = activeSeat;
    this.checkActiveSeatAI();
  }

  checkActiveSeatAI(): void {
    const player = this.activeSeat === -1 ? this.dealer : this.seats[this.activeSeat];

    if (player.isDealer || player.isNPC) {
      const hitOrStay = player.hitOrStay();

      if (hitOrStay === `STAY`) {
        player.hasStayed = true;

        if (!player.isDealer) {
          this.advancePlayersChoice();
        }
      } else {
        this.dealCardToPlayer({ player });

        if (!player.isBusted) {
          this.checkActiveSeatAI();
        } else {
          this.advancePlayersChoice();
        }
      }
    }
  }

  checkForCutCard({ card }: { card?: IPlayingCard } = {}): void {
    if (card?.isCutCard) {
      this.isCutCardOut = true;
      console.log(`Cut card is out.`);
    }
  }

  async postStartRound(): Promise<void> {
    const dealerUpCard = this.dealer.cards[1];

    if (dealerUpCard.cardName === `Ace` || dealerUpCard.value === 10) {
      /** TODO Offer insurance for blackjack **/
      await this.offerDealerBlackjackInsurance();

      /** Check for dealer blackjack **/
      if (this.dealer.hasBlackjack) {
        // Dealer has blackjack, logic will be handled in resolveBlackjackForPlayer
      }
    }

    /** Check for player blackjacks **/
    for (const player of this.seats) {
      if (!player.isPlaceholder) {
        if (player.hasBlackjack) {
          this.resolveBlackjackForPlayer({ player });
        }
      }
    }
  }

  async offerDealerBlackjackInsurance(): Promise<void> {
    /* empty */
  }

  /**
   * If player has blackjack and dealer does not, pay player 3:2
   * @param {BlackjackPlayer} player
   * **/
  resolveBlackjackForPlayer({ player }: { player: BlackjackPlayer }): void {
    if (player.hasBlackjack && !this.dealer.hasBlackjack) {
      // Pay player 3:2
    } else if (player.hasBlackjack && this.dealer.hasBlackjack) {
      const insuranceWager = player.wagers.find((wager) => wager.type === 'INSURANCE');

      if (insuranceWager) {
        // Player had insurance, push
      } else {
        // Push
      }
    }
  }

  muckCards(): void {
    console.log(`Cards remaining`, this.shoe.cards.length);
    for (const player of this.seats) {
      this.muckedCards.push(...player.cards);
      player.resetHand();
    }
    this.muckedCards.push(...this.dealer.cards);
    this.dealer.resetHand();

    if (this.isCutCardOut) {
      console.log(`cut card is out, creating new shoe`);
      this.createShoe();
    }
  }
}
