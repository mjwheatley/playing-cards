import { describe, expect, it } from 'vitest';

import { DeckOfCards } from './deck-of-cards.js';

describe('DeckOfCards Unit Tests', () => {
  describe('constructor()', () => {
    it('should construct a deck with 54 cards by default (including Jokers)', () => {
      const deck = new DeckOfCards();

      expect(deck.cards.length).toBe(54);
      expect(deck.includesJokers).toBe(true);
    });

    it('should construct a deck with 52 cards when includesJokers is false', () => {
      const deck = new DeckOfCards({ includesJokers: false });

      expect(deck.cards.length).toBe(52);
      expect(deck.includesJokers).toBe(false);
    });
  });

  describe('removeJokers()', () => {
    it('should remove Jokers from a fresh deck', () => {
      const deck = new DeckOfCards();

      expect(deck.cards.length).toBe(54);

      deck.removeJokers();

      expect(deck.cards.length).toBe(52);
      expect(deck.includesJokers).toBe(false);
    });

    it('should remove Jokers after the deck has been shuffled', () => {
      const deck = new DeckOfCards();

      deck.shuffle();
      expect(deck.hasBeenShuffled).toBe(true);

      deck.removeJokers();

      expect(deck.cards.length).toBe(52);
      expect(deck.includesJokers).toBe(false);
      // Ensure no Jokers remain (cardNumber 15)
      expect(deck.cards.some((card) => card.cardNumber === 15)).toBe(false);
    });
  });

  describe('shuffle()', () => {
    it('should randomize the order of cards', () => {
      const deck = new DeckOfCards({ includesJokers: false });

      // Initial state: 2 of Clubs is first, Ace of Diamonds is last
      expect(deck.cards[0].fullCardName).toBe('2 of Clubs');
      expect(deck.cards[deck.cards.length - 1].fullCardName).toBe('Ace of Diamonds');

      deck.shuffle();

      expect(deck.hasBeenShuffled).toBe(true);
      // It is statistically improbable for the deck to remain identical
      expect(deck.cards[0].fullCardName).not.toBe('2 of Clubs');
      expect(deck.cards[deck.cards.length - 1].fullCardName).not.toBe('Ace of Diamonds');
    });
  });
});
