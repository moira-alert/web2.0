import { MoiraUrlParams } from "../Domain/MoiraUrlParams";

/**
 * Разбирает строку настроек Мойры из локального хранилища и возвращает объект с результатом
 * @param {string} localData строка из локального хранилища
 * @returns {Object} результат разбора
 */
function parseLocalStorage(localData: string): MoiraUrlParams {
    const DEFAULT_MOIRA_URL_PARAMS: MoiraUrlParams = {
        page: 0,
        tags: [],
        onlyProblems: false,
        searchText: "",
    };

    try {
        const result: MoiraUrlParams = { ...DEFAULT_MOIRA_URL_PARAMS };
        const { tags, onlyProblems } = JSON.parse(localData);

        /*
            Данные пользовательские, поэтому нужно быть уверенным:
            - что tags будет массивом строк
            - что onlyProblems будет булевым
        */
        if (Array.isArray(tags)) {
            result.tags = tags.map((value) => value.toString());
        }
        if (onlyProblems !== undefined) {
            result.onlyProblems = onlyProblems === "false" ? false : Boolean(onlyProblems);
        }
        return result;
    } catch (error) {
        return { ...DEFAULT_MOIRA_URL_PARAMS };
    }
}

export { parseLocalStorage as default };
