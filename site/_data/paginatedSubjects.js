import subjectSets from "./subjectSets.js";
import subjects from "./subjects.js";

function pageSubjects(groupSubjects) {
  if (groupSubjects.length === 0) {
    return [];
  }
  const pageSize = 50;
  const subjectPages = [];
  const { set } = groupSubjects[0];
  const pageCount = Math.ceil(groupSubjects.length / pageSize);
  for (let i = 0; i < pageCount; i++) {
    const start = i * pageSize;
    const finish = start + pageSize;
    const pageSubjects = groupSubjects.slice(start, finish);
    subjectPages.push({
      set,
      page: i + 1,
      pageCount,
      subjects: pageSubjects,
    });
  }
  return subjectPages;
}

async function paginatedSubjects() {
  let groupedSubjects = [];
  subjectSets.forEach((set) => {
    const groupSubjects = subjects
      .filter((subject) => subject.links.subject_sets.includes(set.id))
      .map((subject) => ({
        ...subject,
        set,
      }));
    groupedSubjects = groupedSubjects.concat(pageSubjects(groupSubjects));
  });
  return groupedSubjects;
}

export default paginatedSubjects();
