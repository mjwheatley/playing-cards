import { describe, expect, it } from 'vitest';

import { BlackjackPlayer, BlackjackDecision, BlackjackNPCType } from './blackjack-player.js';

describe(`BlackjackPlayer Unit Tests`, () => {
  describe(`constructor()`, () => {
    it(`should successfully construct a new BlackjackPlayer`, () => {
      const player = new BlackjackPlayer({ name: `Player 1` });

      expect(player.name).toBe(`Player 1`);
    });
  });

  describe(`receiveCard()`, () => {
    it(`should add a card to players hand and set the player's handValue`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 11 } });
      player.receiveCard({ card: { value: 10 } });
      expect(player.handValue).toBe(21);
    });

    it(`should set the handValue to a soft value with one Ace`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 11 } });
      player.receiveCard({ card: { value: 4 } });
      expect(player.handValue).toBe(15);
      expect(player.handValueIsHard).toBe(false);
    });

    it(`should set the handValue to a soft value with two Aces`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 11 } });
      player.receiveCard({ card: { value: 11 } });
      expect(player.handValue).toBe(12);
      expect(player.handValueIsHard).toBe(false);
    });

    it(`should change from a soft handValue to hard`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 11 } });
      player.receiveCard({ card: { value: 5 } });
      player.receiveCard({ card: { value: 6 } });
      expect(player.handValue).toBe(12);
      expect(player.handValueIsHard).toBe(true);
    });

    it(`should count 1st Ace as 1 if handValue would exceed 21`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 11 } });
      expect(player.handValue).toBe(21);
      expect(player.handValueIsHard).toBe(true);
    });

    it(`should set isBusted to true when handValue exceeds 21`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 5 } });
      expect(player.handValue).toBe(25);
      expect(player.isBusted).toBe(true);
    });

    it(`should detect a natural blackjack (Ace + 10)`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 11 } });
      player.receiveCard({ card: { value: 10 } });
      expect(player.handValue).toBe(21);
      expect(player.hasBlackjack).toBe(true);
    });

    it(`should NOT detect blackjack if total is 21 but has more than 2 cards`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 5 } });
      player.receiveCard({ card: { value: 6 } });
      expect(player.handValue).toBe(21);
      expect(player.hasBlackjack).toBe(false);
    });
  });

  describe(`resetHand()`, () => {
    it(`should reset hand state to defaults`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 11 } });
      player.hasStayed = true;

      player.resetHand();

      expect(player.cards).toEqual([]);
      expect(player.handValue).toBe(0);
      expect(player.handValueIsHard).toBe(true);
      expect(player.hasBlackjack).toBe(false);
      expect(player.isBusted).toBe(false);
      expect(player.hasStayed).toBe(false);
    });
  });

  describe(`hitOrStay()`, () => {
    it(`should return HIT for dealer when handValue < 17`, () => {
      const player = new BlackjackPlayer({ isDealer: true });

      // Note: we need to actually add cards to set handValue since it's now a getter
      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 6 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.HIT);
    });

    it(`should return STAY for dealer when handValue >= 17`, () => {
      const player = new BlackjackPlayer({ isDealer: true });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 7 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.STAY);
    });

    it(`should return HIT for buster NPC regardless of handValue`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.BUSTER });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 10 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.HIT);
    });

    it(`should return HIT for risky NPC when handValue < 21`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.RISKY });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 10 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.HIT);
    });

    it(`should return STAY for risky NPC when handValue >= 21`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.RISKY });

      player.receiveCard({ card: { value: 11 } });
      player.receiveCard({ card: { value: 10 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.STAY);
    });

    it(`should return HIT for wary NPC when handValue < 14`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.WARY });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 3 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.HIT);
    });

    it(`should return STAY for wary NPC when handValue >= 14`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.WARY });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 4 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.STAY);
    });

    it(`should return HIT for cautious NPC when handValue < 16`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.CAUTIOUS });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 5 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.HIT);
    });

    it(`should return STAY for cautious NPC when handValue >= 16`, () => {
      const player = new BlackjackPlayer({ npcType: BlackjackNPCType.CAUTIOUS });

      player.receiveCard({ card: { value: 10 } });
      player.receiveCard({ card: { value: 6 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.STAY);
    });

    it(`should return STAY when no npcType is provided and not dealer`, () => {
      const player = new BlackjackPlayer();

      player.receiveCard({ card: { value: 10 } });
      expect(player.hitOrStay()).toBe(BlackjackDecision.STAY);
    });
  });
});
