import fetchWithRetry from './fetchWithRetry.js'
import config from "./config.js";

const projectIDs = config.projects.join(",");

/*
Fetches ALL Subjects from a Project.

Ouput:
(array of objects) array of Panoptes Subject resources 
 */
async function fetchAllSubjects(query) {
  let allSubjects = []
  let continueFetching = true
  let page = 1

  while (continueFetching) {
    const { subjects, meta } = await fetchSubjectsByPage(query, page)
    allSubjects = allSubjects.concat(subjects)
    continueFetching = (+meta.page <= +meta.page_count) || false
    page++
  }

  const uniqueSubjects = [...new Set(allSubjects)]
  console.log('subjects:', uniqueSubjects.length)
  return uniqueSubjects.sort((a, b) => parseInt(a.id) - parseInt(b.id));
}

/*
Fetches SOME Subjects from a Project.

Output: (object) {
  subjects: (array) array of Panoptes Subject resources
  meta: (object) contains .count (total items available) and .page_count (total pages available)
}
 */
async function fetchSubjectsByPage(query, page = 1, pageSize = 100) {
  try {
    const { subjects, meta }  = await fetchWithRetry('/subjects', {
      ...query,
      page,
      page_size: pageSize,
      order: 'id'
    })
    return { subjects, meta: meta.subjects }
  } catch (err) {
    console.error('ERROR: fetchSubjectsByPage()')
    console.error('- error: ', err)
    console.error('- args: ', projectId, page, pageSize)
    throw(err)
  }
}

export default await fetchAllSubjects({ project_id: projectIDs })
