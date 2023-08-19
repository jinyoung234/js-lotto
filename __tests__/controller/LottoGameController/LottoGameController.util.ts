import LottoGameController from '@step1/controller/LottoGameController';
import { LottoGame } from '@step1/model';
import { InputView } from '@step1/view';

export const runLottoGameController = async () => {
  await new LottoGameController().run();
};

export const mockInputView = (
  { investmentAmount = '1000', winningLottoNumbers = '1,2,3,4,5,6', bonusNumber = '7', gameCommand = 'end' } = {
    investmentAmount: '1000',
    winningLottoNumbers: '1,2,3,4,5,6',
    bonusNumber: '7',
    gameCommand: 'end',
  },
) => {
  InputView.inputByUser = jest
    .fn()
    .mockResolvedValueOnce(investmentAmount)
    .mockResolvedValueOnce(winningLottoNumbers)
    .mockResolvedValueOnce(bonusNumber)
    .mockResolvedValueOnce(gameCommand);
};

export const mockCreateLottoNumbers = (lottos = [[1, 2, 3, 4, 5, 6]]) => {
  jest.mock('@step1/model/LottoGame');
  LottoGame.prototype.createLottoNumbers = () => {
    const result = [];
    lottos.forEach((lotto) => result.push(lotto as never));
    return result;
  };
};