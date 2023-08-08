import { END_GAME, RESTART_GAME } from '../constants/controller.js';
import { INPUT_MESSAGE, OUTPUT_MESSAGE } from '../constants/message.js';
import { LottoBuyer } from '../model/index.js';
import { InputView, OutputView } from '../view/index.js';

export default class LottoGameController {
  #lottoBuyer;

  constructor() {
    this.#init();
  }

  static #convertLottoResultForPrint(result) {
    return Object.entries(result)
      .map((element) => `${element.join(' - ')}개`)
      .join('\n');
  }

  static #convertRateOfReturnForPrint(rateOfReturn) {
    return `총 수익률은 ${rateOfReturn}입니다.`;
  }

  #init() {
    this.#lottoBuyer = new LottoBuyer();
  }

  async #initializeAmount() {
    const amount = await InputView.inputByUser(INPUT_MESSAGE.BUY_AMOUNT);
    return Number(amount);
  }

  async #initalizeWinningNumbers() {
    const winningNumbers = await InputView.inputByUser(INPUT_MESSAGE.WINNING_NUMBERS);
    return winningNumbers.split(',').map(Number);
  }

  async #initializeBonusNumber() {
    const bonusNumber = await InputView.inputByUser(INPUT_MESSAGE.BONUS_NUMBER);
    return Number(bonusNumber);
  }

  async #initializeNumbers() {
    const winningNumbers = await this.#initalizeWinningNumbers();
    const bonusNumber = await this.#initializeBonusNumber();
    return [winningNumbers, bonusNumber];
  }

  async #initializeEndCount() {
    const endCount = await InputView.inputByUser(INPUT_MESSAGE.END_COUNT);
    return endCount;
  }

  #requestBuyingLotto(amount) {
    return this.#lottoBuyer.buyLotto(amount);
  }

  #printLottos(lottos) {
    OutputView.printFor(OUTPUT_MESSAGE.BUY_COUNT(lottos));
    OutputView.printFor(OUTPUT_MESSAGE.LOTTO_LIST(lottos));
  }

  #requestResults({ investmentAmount, lottos, winningNumbers, bonusNumber }) {
    return this.#lottoBuyer.confirmResult({ investmentAmount, lottos, winningNumbers, bonusNumber });
  }

  #printLottoResults(result, rateOfReturn) {
    OutputView.printFor(OUTPUT_MESSAGE.RESULT_TITLE);
    OutputView.printFor(result);
    OutputView.printFor(rateOfReturn);
  }

  async #processLottos() {
    const investmentAmount = await this.#initializeAmount();
    const lottos = this.#requestBuyingLotto(investmentAmount);
    return [investmentAmount, lottos];
  }

  async #processPrintLottoResults(investmentAmount, lottos) {
    const [winningNumbers, bonusNumber] = await this.#initializeNumbers();
    const [lottoResult, rateOfReturn] = this.#requestResults({ investmentAmount, lottos, winningNumbers, bonusNumber });
    this.#printLottoResults(
      LottoGameController.#convertLottoResultForPrint(lottoResult),
      LottoGameController.#convertRateOfReturnForPrint(rateOfReturn),
    );
  }

  async #startGame() {
    const [investmentAmount, lottos] = await this.#processLottos();
    this.#printLottos(lottos);
    await this.#processPrintLottoResults(investmentAmount, lottos);
  }

  async #processEndGame(endCount) {
    if (endCount === END_GAME) process.exit();
    if (endCount === RESTART_GAME) {
      this.#init();
      await this.run();
    }
  }

  async #askUserForEndGame() {
    const endCount = await this.#initializeEndCount();
    this.#processEndGame(endCount);
  }

  async run() {
    await this.#startGame();
    await this.#askUserForEndGame();
  }
}
