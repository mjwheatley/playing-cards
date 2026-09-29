import { BlackjackPlayer } from '@mawhea/blackjack-player/blackjack-player';
import { describe, expect, it } from 'vitest';

import { BlackjackTable } from './blackjack-table.js';

describe('BlackjackTable', () => {
  describe('constructor', () => {
    it('should successfully construct a new BlackjackTable', () => {
      const table = new BlackjackTable();

      expect(table.dealer.name).toBe('Dealer1');
      expect(table.seats).toHaveLength(7);
      expect(table.seats.every((seat) => seat.isPlaceholder)).toBe(true);
      expect(table.isAtLeastOnePlayer).toBe(false);
    });
  });

  describe('addPlayerToTable', () => {
    it('should add a player to a valid seat', () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });

      table.addPlayerToTable({ player, seatIndex: 0 });

      expect(table.seats[0]).toBe(player);
      expect(table.isAtLeastOnePlayer).toBe(true);
    });

    it('should throw error for invalid seatIndex', () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });

      expect(() => {
        table.addPlayerToTable({ player, seatIndex: 7 });
      }).toThrow(/Invalid seatIndex/);
      expect(() => {
        table.addPlayerToTable({ player, seatIndex: -1 });
      }).toThrow(/Invalid seatIndex/);
    });
  });

  describe('removePlayerFromTable', () => {
    it('should remove a player and reset isAtLeastOnePlayer if no players left', () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });

      table.addPlayerToTable({ player, seatIndex: 0 });
      expect(table.isAtLeastOnePlayer).toBe(true);

      table.removePlayerFromTable({ seatIndex: 0 });

      expect(table.seats[0].isPlaceholder).toBe(true);
      expect(table.isAtLeastOnePlayer).toBe(false);
    });

    it('should keep isAtLeastOnePlayer true if other players remain', () => {
      const table = new BlackjackTable();
      const p1 = new BlackjackPlayer({ name: 'P1' });
      const p2 = new BlackjackPlayer({ name: 'P2' });

      table.addPlayerToTable({ player: p1, seatIndex: 0 });
      table.addPlayerToTable({ player: p2, seatIndex: 1 });

      table.removePlayerFromTable({ seatIndex: 0 });

      expect(table.isAtLeastOnePlayer).toBe(true);
    });
  });

  describe('dealCardToPlayer', () => {
    it('should deal a card from the shoe to the player', () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });
      const initialShoeCount = table.shoe.cards.length;

      table.dealCardToPlayer({ player });

      expect(player.cards).toHaveLength(1);
      expect(table.shoe.cards).toHaveLength(initialShoeCount - 1);
    });

    it('should set the downCard property correctly', () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });

      table.dealCardToPlayer({ player, isDownCard: true });

      expect(player.cards[0].isDownCard).toBe(true);
    });
  });

  describe('startRound', () => {
    it('should throw if no players are present', async () => {
      const table = new BlackjackTable();

      await expect(table.startRound()).rejects.toThrow(/Unable to start round/);
    });

    it('should deal initial cards to players and dealer', async () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });

      table.addPlayerToTable({ player, seatIndex: 0 });

      await table.startRound();

      expect(player.cards).toHaveLength(2);
      expect(table.dealer.cards).toHaveLength(2);
      // Dealer's first card dealt is downCard
      expect(table.dealer.cards[0].isDownCard).toBe(true);
      // Dealer's second card dealt is upCard
      expect(table.dealer.cards[1].isDownCard).toBe(false);
    });
  });

  describe('muckCards', () => {
    it('should move all cards to muckedCards and reset hands', async () => {
      const table = new BlackjackTable();
      const player = new BlackjackPlayer({ name: 'Player 1' });

      table.addPlayerToTable({ player, seatIndex: 0 });

      await table.startRound();
      const totalCards = player.cards.length + table.dealer.cards.length;

      table.muckCards();

      expect(table.muckedCards).toHaveLength(totalCards);
      expect(player.cards).toHaveLength(0);
      expect(table.dealer.cards).toHaveLength(0);
    });
  });
});
