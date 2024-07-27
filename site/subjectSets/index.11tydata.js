function titlePages({ subjects, subjectSets, workflows }) {
  function titlePage(subject) {
    const [subjectSetID] = subject.links.subject_sets
    const subjectSet = subjectSets.find(s => s.id == subjectSetID)
    if (subjectSet) {
      return {
        href: `/transcription-explorer/pmlogan/poets-and-lovers/subjects/${subject.id}`,
        title: subjectSet.display_name
      }
    }
    return
  }

  const firstPages = subjects.filter(s => s.metadata['#priority'] == '1')
  return firstPages.map(titlePage).filter(Boolean)
}

export default {
  eleventyComputed: {
    titlePages
  }
}