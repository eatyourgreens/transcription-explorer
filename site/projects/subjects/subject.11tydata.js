function subjectTitle({ subject }) {
  return `Subject ${subject.id}`;
}

function thumbnail(src, width = 600) {
  return src
    ? `https://thumbnails.zooniverse.org/${width}x/${src.replace('https://', '')}`
    : '';
}

function subjectLocations({ subject }) {
  return subject.locations.map((loc, index) => ({
    alt: `Page ${index + 1}`,
    src: thumbnail(loc['image/jpeg'])
  }))
}

function ogImage({ subject }) {
  const [firstImage] = subject.locations
  return firstImage['image/jpeg']
}

function description({ subject, subjectSets, workflows, projects }) {
  const w = workflow({ subject, subjectSets, workflows, projects })
  const [subjectSetID] = subject.links.subject_sets
  const subjectSet = subjectSets.find(s => s.id == subjectSetID)
  const pageNumber = subject.metadata['#priority']
  if (w) {
    return `${w.display_name} ${subjectSet.display_name} page ${pageNumber}`
  }
  return `Notebook not found for page ${pageNumber}`
}

function project({ subject, projects }) {
  const projectID = subject.links.project
  if (projectID) {
    return projects.find(p => p.id === projectID)
  }
  return null
}

function subjectSet({ subject, subjectSets }) {
  const [subjectSetID] = subject.links.subject_sets
  return subjectSets.find(s => s.id == subjectSetID)
}

function workflow({ subject, subjectSets, workflows, projects }) {
  const currentProject = project({ subject, projects })
  const projectWorkflows = workflows.filter(w => currentProject.links.workflows.includes(w.id))
  const [subjectSetID] = subject.links.subject_sets
  const subjectSet = subjectSets.find(s => s.id == subjectSetID)
  if (subjectSet) {
    const [workflowID] = subjectSet.links.workflows
    return projectWorkflows.find(w => w.id == workflowID)
  }
  return null
}

function permalink({ projects, subject }) {
  const currentProject = project({ subject, projects })
  return `/${currentProject.slug}/subjects/${subject.id}/`
}

export default {
  eleventyComputed: {
    title: subjectTitle,
    subjectLocations,
    description,
    ogImage,
    subjectSet,
    project,
    workflow
  },
  permalink
}