import { describe, expect, it } from 'vitest';

import { BlackjackHand } from './blackjack-hand.js';

describe(`BlackjackHand Unit Tests`, () => {
  describe(`hasFirstAce()`, () => {
    it(`should return true when the first card is an Ace`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 11 } });
      hand.receiveCard({ card: { value: 10 } });
      expect(hand.hasFirstAce).toBe(true);
    });

    it(`should return false when the first card is not an Ace`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 11 } });
      expect(hand.hasFirstAce).toBe(false);
    });

    it(`should return false for an empty hand`, () => {
      const hand = new BlackjackHand();

      expect(hand.hasFirstAce).toBe(false);
    });
  });

  describe(`receiveCard() and handValue`, () => {
    it(`should calculate value for a simple hand`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 7 } });
      expect(hand.handValue).toBe(17);
    });

    it(`should treat a single Ace as 11 (soft)`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 11 } });
      expect(hand.handValue).toBe(11);
      expect(hand.handValueIsHard).toBe(false);
    });

    it(`should treat a single Ace as 1 if it would bust`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 11 } });
      expect(hand.handValue).toBe(21);
      expect(hand.handValueIsHard).toBe(true);
    });

    it(`should handle multiple Aces correctly`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 11 } });
      hand.receiveCard({ card: { value: 11 } });
      // 11 + 1 = 12 (One soft Ace)
      expect(hand.handValue).toBe(12);
      expect(hand.handValueIsHard).toBe(false);
    });

    it(`should transition from soft to hard when adding cards`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 11 } }); // 11 (soft)
      expect(hand.handValueIsHard).toBe(false);

      hand.receiveCard({ card: { value: 5 } }); // 16 (soft)
      expect(hand.handValueIsHard).toBe(false);

      hand.receiveCard({ card: { value: 6 } }); // 22 -> 12 (hard)
      expect(hand.handValue).toBe(12);
      expect(hand.handValueIsHard).toBe(true);
    });

    it(`should mark as busted when value > 21`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 5 } });
      expect(hand.handValue).toBe(25);
      expect(hand.isBusted).toBe(true);
    });
  });

  describe(`hasBlackjack()`, () => {
    it(`should return true for a natural blackjack (Ace + 10)`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 11 } });
      hand.receiveCard({ card: { value: 10 } });
      expect(hand.hasBlackjack).toBe(true);
    });

    it(`should return false for a 21 achieved with more than 2 cards`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 10 } });
      hand.receiveCard({ card: { value: 5 } });
      hand.receiveCard({ card: { value: 6 } });
      expect(hand.handValue).toBe(21);
      expect(hand.hasBlackjack).toBe(false);
    });

    it(`should return false for a hand with fewer than 2 cards`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 11 } });
      expect(hand.hasBlackjack).toBe(false);
    });
  });

  describe(`clear()`, () => {
    it(`should reset all hand state`, () => {
      const hand = new BlackjackHand();

      hand.receiveCard({ card: { value: 10 } });
      hand.clear();
      expect(hand.cards).toEqual([]);
      expect(hand.handValue).toBe(0);
      expect(hand.isBusted).toBe(false);
    });
  });
});
