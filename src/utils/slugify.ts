import kebabcase from "lodash.kebabcase";

export const slugifyStr = (str: string) => kebabcase(str);
