import * as queryString from "query-string";
import { MoiraUrlParams } from "../Domain/MoiraUrlParams";

/**
 * Разбирает строку с параметрами URL и возвращает объект с результатом
 * @param {string} search строка параметров
 * @returns {Object} результат разбора
 */
function parseLocationSearch(search: string): MoiraUrlParams {
    const result: MoiraUrlParams = {
        page: 0,
        tags: [],
        onlyProblems: false,
        searchText: "",
    };

    const { page, tags, onlyProblems } = queryString.parse(search, { arrayFormat: "index" });

    /*
      Данные пользовательские, поэтому нужно быть уверенным:
      - что page будет целым числом,
      - что tags будет массивом строк
      - что onlyProblems будет булевым
    */
    if (typeof page === "string" && !Number.isNaN(Number(page))) {
        result.page = parseInt(page, 10);
    }
    if (Array.isArray(tags)) {
        result.tags = tags.map((value) => value.toString());
    }
    if (onlyProblems !== undefined) {
        result.onlyProblems = onlyProblems === "false" ? false : Boolean(onlyProblems);
    }
    return result;
}

export { parseLocationSearch as default };
