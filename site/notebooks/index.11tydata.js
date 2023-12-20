function titlePages({ subjects, subjectSets, workflows }) {
  function titlePage(subject) {
    const [subjectSetID] = subject.links.subject_sets
    const subjectSet = subjectSets.find(s => s.id == subjectSetID)
    if (subjectSet) {
      const [workflowID] = subjectSet.links.workflows
      const workflow = workflows.find(w => w.id == workflowID)
      if (workflow) {
        return {
          href: `/read-davy-notebooks/subjects/${subject.id}`,
          title: workflow.display_name
        }
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