import { INPUT_MESSAGE, OUTPUT_MESSAGE_METHOD, OUTPUT_MESSAGE_TEXT } from '../constants/message';
import { LottoGame } from '../model/index';
import { InputView, OutputView } from '../view/index';
import { GAME_PROMPT } from '../constants/controller';
import { CreateResultsParams } from './LottoGameController.type';
import { LottoResult, WinningInfo } from '../utils/jsDoc';

export default class LottoGameController {
  #lottoGame: LottoGame;

  constructor() {
    this.#lottoGame = new LottoGame();
  }

  /**
   * 구입할 로또 금액을 입력 받는 메서드
   * @returns {Promise<number>} 입력 받은 로또 금액의 Promise
   */
  async #initializeAmount(): Promise<number> {
    const amount = await InputView.inputByUser(INPUT_MESSAGE.BUY_AMOUNT);
    return Number(amount);
  }

  /**
   * 로또 당첨 번호를 입력하는 메서드
   * @returns {Promise<string>} 입력 받은 당첨 로또 번호의 Promise
   */
  async #initializeWinningNumbers(): Promise<string> {
    const winningNumbers = await InputView.inputByUser(INPUT_MESSAGE.WINNING_NUMBERS);
    return winningNumbers;
  }

  /**
   * 보너스 번호를 입력하는 메서드
   * @returns {Promise<number>} 입력 받은 보너스 번호의 Promise
   */
  async #initializeBonusNumber(): Promise<number> {
    const bonusNumber = await InputView.inputByUser(INPUT_MESSAGE.BONUS_NUMBER);
    return Number(bonusNumber);
  }

  /**
   * 게임 종료 또는 재시작 관련 선택을 입력 받는 메서드
   * @returns {Promise<string>} 게임 종료 또는 재시작 관련 선택에 대한 문자열의 Promise
   */
  async #initializeEndCount(): Promise<string> {
    const endCount = await InputView.inputByUser(INPUT_MESSAGE.END_COUNT);
    return endCount;
  }

  /**
   * 입력한 금액을 통해 로또 번호들을 생성하는 메서드
   * @param {number} amount - 구입 금액
   * @returns {number[][]} - 당첨 번호들이 담겨있는 2차원 배열
   */
  #requestBuyingLotto(amount: number): number[][] {
    return this.#lottoGame.createLottoNumbers(amount);
  }

  /**
   * 구입한 로또 번호들을 출력하는 메서드
   * @param {number[][]} lottoNumbers - 로또 내 존재하는 로또 번호들
   */
  #printLottos(lottoNumbers: number[][]) {
    OutputView.printFor(OUTPUT_MESSAGE_TEXT.BUY_COUNT(lottoNumbers.length));
    OutputView.printFor(OUTPUT_MESSAGE_METHOD.LOTTO_LIST(lottoNumbers));
  }

  /**
   * 로또 게임의 당첨 정보를 생성하는 메서드
   * @param {CreateResultsParams} CreateResultsParams - createResults의 매개 변수 목록에 대한 객체
   * @param {number} CreateResultsParams.investmentAmount - 로또 구매 금액
   * @param {number[][]} CreateResultsParams.lottoNumbers - 로또 당첨 번호들
   * @param {number[]} CreateResultsParams.winningLottoNumber - 우승 로또 번호
   * @param {number} CreateResultsParams.bonusNumber - 보너스 번호
   * @returns {WinningInfo} 당첨 정보
   */
  #requestResults({
    investmentAmount,
    lottoNumbers,
    winningLottoNumber,
    bonusNumber,
  }: CreateResultsParams): WinningInfo {
    return this.#lottoGame.createResults({ investmentAmount, lottoNumbers, winningLottoNumber, bonusNumber });
  }

  /**
   * 로또 게임의 결과 및 수익률을 출력하는 메서드
   * @param {LottoResult} lottoResult - 로또 당첨 결과
   * @param {string} rateOfReturn - 수익률에 대해 포맷팅 된 문자열
   */
  #printLottoResults(lottoResult: LottoResult, rateOfReturn: string) {
    OutputView.printFor(OUTPUT_MESSAGE_TEXT.RESULT_TITLE);
    OutputView.printFor(OUTPUT_MESSAGE_METHOD.RESULT(lottoResult));
    OutputView.printFor(OUTPUT_MESSAGE_TEXT.RATE_OF_RETURN(rateOfReturn));
  }

  /**
   * "로또 구매 금액 입력 ~ 로또 생성"까지의 과정에 대한 메서드
   * @returns {Promise<[number, number[][]]>} 당첨 금액, 로또 번호에 대한 배열의 Promise
   */
  async #processLottos(): Promise<[number, number[][]]> {
    const investmentAmount = await this.#initializeAmount();
    const lottoNumbers = this.#requestBuyingLotto(investmentAmount);
    return [investmentAmount, lottoNumbers];
  }

  /**
   * "당첨 번호 및 보너스 번호 입력 ~ 로또 당첨 정보 및 수익률 출력"까지의 과정을 처리하는 메서드
   * @param {number} investmentAmount - 로또 구매 금액
   * @param {number[][]} lottoNumbers - 로또 당첨 번호들
   */
  async #processPrintLottoResults(investmentAmount: number, lottoNumbers: number[][]) {
    const winningNumbers = await this.#initializeWinningNumbers();
    const winningLottoNumber = this.#lottoGame.createWinningLottoNumbers(winningNumbers);
    const bonusNumber = await this.#initializeBonusNumber();
    const { lottoResult, rateOfReturn } = this.#requestResults({
      investmentAmount,
      lottoNumbers,
      winningLottoNumber,
      bonusNumber,
    });
    this.#printLottoResults(lottoResult, rateOfReturn);
  }

  /**
   * 전체적인 게임을 진행하는 메서드
   */
  async #startGame() {
    const [investmentAmount, lottoNumbers] = await this.#processLottos();
    this.#printLottos(lottoNumbers);
    await this.#processPrintLottoResults(investmentAmount, lottoNumbers);
  }

  /**
   * 게임 종료 및 재시작을 처리하는 메서드
   * @param {string} endPrompt - 종료 명령어
   */
  async #processEndGame(endPrompt: string) {
    if (endPrompt === GAME_PROMPT.END_GAME) process.exit();
    if (endPrompt === GAME_PROMPT.RESTART_GAME) {
      await this.run();
    }
  }

  /**
   * 게임 종료 또는 재시작에 대한 사용자의 선택을 처리하는 메서드
   */
  async #askUserForEndGame() {
    const endCount = await this.#initializeEndCount();
    this.#processEndGame(endCount);
  }

  /**
   * 전체적인 LottoGame의 로직들을 처리하는 메서드
   */
  async run() {
    await this.#startGame();
    await this.#askUserForEndGame();
  }
}