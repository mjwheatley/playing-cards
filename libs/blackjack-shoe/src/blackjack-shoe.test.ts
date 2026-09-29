import { describe, expect, it } from 'vitest';

import { BlackjackShoe } from './blackjack-shoe.js';

describe('BlackjackShoe Unit Tests', () => {
  describe('constructor()', () => {
    it('should successfully construct a new BlackjackShoe with the specified number of playing card decks', () => {
      const shoe = new BlackjackShoe();

      expect(shoe.numberOfDecks).toBe(6);
      expect(shoe.cards.length).toBe(6 * 52);

      const oneDeckShoe = new BlackjackShoe({ numberOfDecks: 1 });

      expect(oneDeckShoe.numberOfDecks).toBe(1);
      expect(oneDeckShoe.cards.length).toBe(52);

      const fourDeckShoe = new BlackjackShoe({ numberOfDecks: 4 });

      expect(fourDeckShoe.numberOfDecks).toBe(4);
      expect(fourDeckShoe.cards.length).toBe(4 * 52);

      expect(shoe.cards[0].fullCardName).toBe('2 of Clubs');
      expect(shoe.cards[shoe.cards.length - 1].fullCardName).toBe('Ace of Diamonds');
    });
  });

  describe('shuffle()', () => {
    it('should shuffle the shoe of cards', () => {
      const shoe = new BlackjackShoe();

      const firstCardName = shoe.cards[0].fullCardName;
      const lastCardName = shoe.cards[shoe.cards.length - 1].fullCardName;

      shoe.shuffle();

      expect(shoe.cards[0].fullCardName).not.toBe(firstCardName);
      expect(shoe.cards[shoe.cards.length - 1].fullCardName).not.toBe(lastCardName);
    });
  });

  describe('generateCutNumber()', () => {
    it('should randomly generate a cut number between 1/2 deck and 2 decks of cards', () => {
      const shoe = new BlackjackShoe();

      for (let i = 0; i < 10000; i++) {
        const cutNumber = shoe.generateCutNumber();

        expect(cutNumber).toBeLessThanOrEqual(104);
        expect(cutNumber).toBeGreaterThanOrEqual(26);
      }
    });
  });

  describe('cut()', () => {
    it('should cut the shoe of cards using the provided cutNumber', () => {
      const cutNumber = 33;
      const shoe = new BlackjackShoe();

      shoe.cut({ cutNumber });
      expect(shoe.cards[shoe.cards.length - cutNumber].isCutCard).toBe(true);
    });

    it('should throw an error if the cutNumber is invalid', () => {
      const shoe = new BlackjackShoe();

      expect(() => {
        shoe.cut({ cutNumber: 25 });
      }).toThrow('cutNumber[25] must be between 26 and 104');
      expect(() => {
        shoe.cut({ cutNumber: 105 });
      }).toThrow('cutNumber[105] must be between 26 and 104');
    });
  });
});
