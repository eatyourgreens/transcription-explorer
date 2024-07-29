import fetchWithRetry from './fetchWithRetry.js'
import config from "./config.js";

const projectIDs = config.projects.join(",");

/*
Fetches ALL Subject Sets from a Project.

Ouput:
(array of objects) array of Panoptes Subject Set resources 
 */
async function fetchAllSubjectSets(query) {
  let allSubjectSets = []
  let continueFetching = true
  let page = 1

  while (continueFetching) {
    const { subject_sets, meta } = await fetchSubjectSetsByPage(query, page)
    allSubjectSets = allSubjectSets.concat(subject_sets)
    continueFetching = (+meta.page <= +meta.page_count) || false
    page++
  }

  const uniqueSubjectSets = [...new Set(allSubjectSets)]
  console.log('subject sets:', uniqueSubjectSets.length)
  return uniqueSubjectSets
}

/*
Fetches SOME Subject Sets from a Project.

Output: (object) {
  subject_sets: (array) array of Panoptes Subject resources
  meta: (object) contains .count (total items available) and .page_count (total pages available)
}
 */
async function fetchSubjectSetsByPage(query, page = 1, pageSize = 100) {
  try {
    const { subject_sets, meta }  = await fetchWithRetry('/subject_sets', {
      ...query,
      page,
      page_size: pageSize,
      order: 'id'
    })
    return { subject_sets, meta: meta.subject_sets }
  } catch (err) {
    console.error('ERROR: fetchSubjectSetsByPage()')
    console.error('- error: ', err)
    console.error('- args: ', projectId, page, pageSize)
    throw(err)
  }
}

export default await fetchAllSubjectSets({ project_id: projectIDs })
