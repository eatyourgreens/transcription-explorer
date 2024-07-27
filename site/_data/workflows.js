import fetchWithRetry from './fetchWithRetry.js'

/*
Fetches ALL Workflows from a Project.

Ouput:
(array of objects) array of Panoptes Workflow resources 
 */
async function fetchAllWorkflows(query) {
  let allWorkflows = []
  let continueFetching = true
  let page = 1

  while (continueFetching) {
    const { workflows, meta } = await fetchWorkflowsByPage(query, page)
    allWorkflows = allWorkflows.concat(workflows)
    continueFetching = (+meta.page <= +meta.page_count) || false
    page++
  }

  const uniqueWorkflows = [...new Set(allWorkflows)]
  console.log('workflows:', uniqueWorkflows.length)
  return uniqueWorkflows
}

/*
Fetches SOME Workflows from a Project.

Output: (object) {
  subjects: (array) array of Panoptes Workflow resources
  meta: (object) contains .count (total items available) and .page_count (total pages available)
}
 */
async function fetchWorkflowsByPage(query, page = 1, pageSize = 100) {
  try {
    const { workflows, meta }  = await fetchWithRetry('/workflows', {
      ...query,
      page,
      page_size: pageSize
    })
    return { workflows, meta: meta.workflows }
  } catch (err) {
    console.error('ERROR: fetchWorkflowsByPage()')
    console.error('- error: ', err)
    console.error('- args: ', projectId, page, pageSize)
    throw(err)
  }
}

export default fetchAllWorkflows({ project_id: '15597' })
