

/**
 * Переводит номер страницы с человеческого на программистский
 * @param {number} page человеческий номер
 * @returns {number} программистский номер
 */
function transformPageFromHumanToProgrammer(page: number): number {
  return page <= 0 ? 0 : page - 1;
}

export { transformPageFromHumanToProgrammer as default };