import { SITE } from "@config";
import getPageNumbers from "./getPageNumbers";

interface GetPaginationProps<T> {
  studies: T;
  page: string | number;
  isIndex?: boolean;
}

const getPagination = <T>({
  studies,
  page,
  isIndex = false,
}: GetPaginationProps<T[]>) => {
  const totalPagesArray = getPageNumbers(studies.length);
  const totalPages = totalPagesArray.length;

  const currentPage = isIndex
    ? 1
    : page && !isNaN(Number(page)) && totalPagesArray.includes(Number(page))
      ? Number(page)
      : 0;

  const lastStudy = isIndex ? SITE.studyPerPage : currentPage * SITE.studyPerPage;
  const startStudy = isIndex ? 0 : lastStudy - SITE.studyPerPage;
  const paginatedStudies = studies.slice(startStudy, lastStudy);

  return {
    totalPages,
    currentPage,
    paginatedStudies,
  };
};

export default getPagination;
