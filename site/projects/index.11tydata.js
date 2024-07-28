function titlePages({ project, subjects, subjectSets }) {
  function titlePage(subjectSet) {
    const subject = subjects.find(s => s.links.subject_sets.includes(subjectSet.id))
    if (subject) {
      return {
        href: `/transcription-explorer/subjects/${subject.id}`,
        title: subjectSet.display_name,
        subjectCount: subjectSet.set_member_subjects_count
      }
    }
    return
  }

  return subjectSets
    .filter(subjectSet => subjectSet.links.project === project.id)
    .map(titlePage).filter(Boolean)
}

export default {
  eleventyComputed: {
    titlePages
  }
}