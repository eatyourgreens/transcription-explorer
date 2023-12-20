function subjectTitle({ subject }) {
  return `Subject ${subject.id}`;
}

function subjectLocations({ subject }) {
  return subject.locations.map((loc, index) => ({
    alt: `Page ${index + 1}`,
    src: loc['image/jpeg']
  }))
}

function ogImage({ subject }) {
  const [firstImage] = subject.locations
  return firstImage['image/jpeg']
}

function description({ subject, subjectSets, workflows }) {
  const w = workflow({ subject, subjectSets, workflows })
  const pageNumber = subject.metadata['#priority']
  if (w) {
    return `${w.display_name} page ${pageNumber}`
  }
  return `Notebook not found for page ${pageNumber}`
}

function workflow({ subject, subjectSets, workflows }) {
  const [subjectSetID] = subject.links.subject_sets
  const subjectSet = subjectSets.find(s => s.id == subjectSetID)
  if (subjectSet) {
    const [workflowID] = subjectSet.links.workflows
    return workflows.find(w => w.id == workflowID)
  }
  return null
}

export default {
  eleventyComputed: {
    title: subjectTitle,
    subjectLocations,
    description,
    ogImage,
    workflow
  }
}