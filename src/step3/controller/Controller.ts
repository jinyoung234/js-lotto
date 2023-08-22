import { LottoGame } from '@step1/model';

export default class Controller {
  protected lottoGame: LottoGame;

  constructor(lottoGame?: LottoGame) {
    this.lottoGame = lottoGame || new LottoGame();
  }

  protected initEvent() {}

  protected reset() {}
}
