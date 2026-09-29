import { describe, expect, it } from 'vitest';

import { PlayingCard, Suit, DeckType } from './playing-card.js';

describe('PlayingCard Unit Tests', () => {
  describe('constructor()', () => {
    it('should successfully construct a new PlayingCard', () => {
      const cases = [
        { cardNumber: 2, suitEnum: Suit.Club, expectedNum: 2, expectedSuit: Suit.Club },
        { cardNumber: 11, suitEnum: Suit.Heart, expectedNum: 11, expectedSuit: Suit.Heart },
        { cardNumber: 14, suitEnum: Suit.Spade, expectedNum: 14, expectedSuit: Suit.Spade },
        { cardNumber: 15, suitEnum: Suit.None, expectedNum: 15, expectedSuit: Suit.None },
      ];

      for (const { cardNumber, suitEnum, expectedNum, expectedSuit } of cases) {
        const card = new PlayingCard({ cardNumber, suitEnum });

        expect(card.cardNumber).toBe(expectedNum);
        expect(card.suitEnum).toBe(expectedSuit);
      }
    });

    it('should throw an error for an invalid cardNumber', () => {
      const invalidNumbers = [undefined, 0, -1, 16, 2.5];

      for (const num of invalidNumbers) {
        expect(() => new PlayingCard({ cardNumber: num as any, suitEnum: Suit.Club })).toThrow(
          `Invalid cardNumber [${num}]. Only 2-15 integers allowed.`,
        );
      }
    });

    it('should throw an error for an invalid suitEnum', () => {
      const invalidSuits = [undefined, 5, 2.5];

      for (const suit of invalidSuits) {
        expect(() => new PlayingCard({ cardNumber: 2, suitEnum: suit as any })).toThrow(
          `Invalid suitEnum [${suit}]. Only 0-4 integers allowed.`,
        );
      }
    });
  });

  describe('getSuitName()', () => {
    it('should return the correct suit name for all suits', () => {
      const suits = [
        { enum: Suit.Club, name: 'Club' },
        { enum: Suit.Heart, name: 'Heart' },
        { enum: Suit.Spade, name: 'Spade' },
        { enum: Suit.Diamond, name: 'Diamond' },
        { enum: Suit.None, name: 'None' },
      ];

      for (const { enum: suitEnum, name } of suits) {
        const card = new PlayingCard({ cardNumber: 2, suitEnum });

        expect(card.getSuitName()).toBe(name);
      }
    });
  });

  describe('getCardName()', () => {
    it('should return numeric strings for 2-10', () => {
      for (let i = 2; i <= 10; i++) {
        const card = new PlayingCard({ cardNumber: i, suitEnum: Suit.Club });

        expect(card.getCardName()).toBe(i.toString());
      }
    });

    it('should return face names for 11-15', () => {
      const faceCards = [
        { num: 11, name: 'Jack' },
        { num: 12, name: 'Queen' },
        { num: 13, name: 'King' },
        { num: 14, name: 'Ace' },
        { num: 15, name: 'Joker' },
      ];

      for (const { num, name } of faceCards) {
        const card = new PlayingCard({ cardNumber: num, suitEnum: Suit.Club });

        expect(card.getCardName()).toBe(name);
      }
    });
  });

  describe('getFullCardName()', () => {
    it('should return the correct formatted full name', () => {
      const cases = [
        { num: 2, suit: Suit.Club, expected: '2 of Clubs' },
        { num: 12, suit: Suit.Heart, expected: 'Queen of Hearts' },
        { num: 14, suit: Suit.Spade, expected: 'Ace of Spades' },
        { num: 15, suit: Suit.None, expected: 'Joker of Nones' },
      ];

      for (const { num, suit, expected } of cases) {
        const card = new PlayingCard({ cardNumber: num, suitEnum: suit });

        expect(card.getFullCardName()).toBe(expected);
      }
    });
  });

  describe('getCardValue()', () => {
    it('should return the cardNumber by default', () => {
      const card = new PlayingCard({ cardNumber: 7, suitEnum: Suit.Club });

      expect(card.getCardValue()).toBe(7);
    });

    it('should return blackjack values when deckType is blackjack', () => {
      const blackjackCases = [
        { num: 2, expected: 2 },
        { num: 10, expected: 10 },
        { num: 11, expected: 10 }, // Jack
        { num: 12, expected: 10 }, // Queen
        { num: 13, expected: 10 }, // King
        { num: 14, expected: 11 }, // Ace
        { num: 15, expected: -1 }, // Joker
      ];

      for (const { num, expected } of blackjackCases) {
        const card = new PlayingCard({ cardNumber: num, suitEnum: Suit.Club, deckType: DeckType.Blackjack });

        expect(card.getCardValue()).toBe(expected);
      }
    });
  });

  describe('getCardSymbol()', () => {
    it('should return the numeric value for 2-10', () => {
      for (let i = 2; i <= 10; i++) {
        const card = new PlayingCard({ cardNumber: i, suitEnum: Suit.Club });

        expect(card.getCardSymbol()).toBe(i.toString());
      }
    });

    it('should return first letter for 11-14', () => {
      const faceSymbols = [
        { num: 11, sym: 'J' },
        { num: 12, sym: 'Q' },
        { num: 13, sym: 'K' },
        { num: 14, sym: 'A' },
      ];

      for (const { num, sym } of faceSymbols) {
        const card = new PlayingCard({ cardNumber: num, suitEnum: Suit.Club });

        expect(card.getCardSymbol()).toBe(sym);
      }
    });

    it('should return "Joker" for cardNumber 15', () => {
      const card = new PlayingCard({ cardNumber: 15, suitEnum: Suit.None });

      expect(card.getCardSymbol()).toBe('Joker');
    });
  });

  describe('getObject()', () => {
    it('should return a complete IPlayingCard object', () => {
      const card = new PlayingCard({
        cardNumber: 11,
        suitEnum: Suit.Heart,
        deckType: DeckType.Blackjack,
      });
      const obj = card.getObject();

      expect(obj).toEqual({
        cardNumber: 11,
        suitEnum: Suit.Heart,
        suitName: 'Heart',
        cardName: 'Jack',
        fullCardName: 'Jack of Hearts',
        value: 10,
        symbol: 'J',
      });
    });
  });
});
