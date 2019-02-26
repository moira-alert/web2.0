// @flow
import type { MoiraUrlParams } from "../Domain/MoiraUrlParams";

/**
 * Разбирает строку настроек Мойры из локального хранилища и возвращает объект с результатом
 * @param {string} localData строка из локального хранилища
 * @returns {Object} результат разбора
 */
function parseLocalStorage(localData: string): MoiraUrlParams {
    try {
        const result = {};
        const { tags, onlyProblems } = JSON.parse(localData);
        /*
            Данные пользовательские, поэтому нужно быть уверенным:
            - что tags будет массивом строк
            - что onlyProblems будет булевым
        */
        if (Array.isArray(tags)) {
            result.tags = tags.map(value => value.toString());
        }
        if (onlyProblems !== undefined) {
            result.onlyProblems = onlyProblems === "false" ? false : Boolean(onlyProblems);
        }
        return result;
    } catch (error) {
        return {};
    }
}

export { parseLocalStorage as default };
