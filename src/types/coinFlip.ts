export type CoinFlipChoice = 'heads' | 'tails';

export type CoinFlipPlayResponse = {
  won: boolean;
  outcome: CoinFlipChoice;
  diamondsAfter: number;
  payoutDiamonds: number;
};
