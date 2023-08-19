import { LOTTO_TERMS } from '@step1/constants/lotto';
import LottoNumberMaker from '@step1/model/LottoNumberMaker';
import {
  isAscendingOrder,
  isDuplicateLottoNumbers,
  isValidLottoNumbersRange,
} from '@step1/utils/validate/lotto/lottoValidate';

describe('LottoNumberMaker 기능 테스트', () => {
  test('LottoNumberMaker가 생성한 로또는 6개의 로또 번호를 가진다.', () => {
    // given
    const lottoNumberMaker = LottoNumberMaker.from();
    // when
    const lottoNumbers = lottoNumberMaker.createLottoNumbers();
    // then
    expect(lottoNumbers.length).toBe(LOTTO_TERMS.DEFAULT_LIMIT_LOTTO_COUNT);
  });

  test(`LottoNumberMaker가 생성한 로또는 ${LOTTO_TERMS.MIN_LOTTO_NUMBER}에서 ${LOTTO_TERMS.MAX_LOTTO_NUMBER}의 숫자 범위를 가진다.`, () => {
    // given
    const lottoNumberMaker = LottoNumberMaker.from();
    // when
    const isValidRange = isValidLottoNumbersRange(lottoNumberMaker.createLottoNumbers());
    // then
    expect(isValidRange).toBeTruthy();
  });

  test(`LottoNumberMaker가 생성한 로또 내 로또 번호들은 중복된 값을 가지지 않는다.`, () => {
    // given
    const lottoNumberMaker = LottoNumberMaker.from();
    // when
    const isDuplicate = isDuplicateLottoNumbers(lottoNumberMaker.createLottoNumbers());
    // then
    expect(isDuplicate).toBeFalsy();
  });

  test('LottoNumberMaker가 생성한 로또 내 로또 번호들은 오름차순으로 정렬되어 있다.', () => {
    // given
    const lottoNumberMaker = LottoNumberMaker.from();
    // when
    const lottoNumbers = lottoNumberMaker.createLottoNumbers();
    // then
    expect(
      lottoNumbers.every((currentLottoNumber, index) => isAscendingOrder({ currentLottoNumber, index, lottoNumbers })),
    ).toBeTruthy();
  });
});