import { SITE } from "@config";

const getPageNumbers = (numberOfStudies: number) => {
  const numberOfPages = numberOfStudies / Number(SITE.studyPerPage);

  let pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(numberOfPages); i++) {
    pageNumbers = [...pageNumbers, i];
  }

  return pageNumbers;
};

export default getPageNumbers;
