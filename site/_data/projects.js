import fetchWithRetry from "../helpers/fetchWithRetry.js";
import config from "./config.js";

const projectIDs = config.projects.join(",");

/*
Fetches a list of Projects from Panoptes.
*/
async function fetchProjects(query) {
  try {
    const { projects } = await fetchWithRetry("/projects", {
      page_size: 100,
      order: "id",
      ...query,
    });
    console.log("projects:", projects.length);
    return projects;
  } catch (err) {
    console.error("ERROR: fetchProjects()");
    console.error("- error: ", err);
    throw err;
  }
}

export default fetchProjects({ id: projectIDs });
