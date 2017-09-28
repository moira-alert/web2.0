// @flow
import numeral from 'numeral';

numeral.register('locale', 'ru', {
    delimiters: {
        thousands: ' ',
        decimal: '.',
    },
});
numeral.locale('ru');

export default numeral;
