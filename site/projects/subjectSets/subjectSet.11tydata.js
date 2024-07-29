function project({ subjectSet, projects }) {
  const projectID = subjectSet.links.project;
  if (projectID) {
    return projects.find((p) => p.id === projectID);
  }
  return null;
}

function thumbnail(src, width = 100) {
  return src
    ? `https://thumbnails.zooniverse.org/${width}x/${src.replace(
        "https://",
        ""
      )}`
    : "";
}

function thumbnails({ config, projects, subjectSet, subjects }) {
  const currentProject = project({ subjectSet, projects });
  return subjects
    .filter((subject) => subject.links.subject_sets.includes(subjectSet.id))
    .map((subject) => {
      const [firstImage] = subject.locations;
      return {
        href: `${config.siteRoot}/${currentProject.slug}/subjects/${subject.id}/`,
        alt: `Subject ${subject.id}`,
        src: thumbnail(firstImage["image/jpeg"]),
      };
    });
}

function permalink({ projects, subjectSet }) {
  const currentProject = project({ subjectSet, projects });
  return `/${currentProject.slug}/subjectSets/${subjectSet.id}/`;
}

export default {
  eleventyComputed: {
    project,
    thumbnails,
  },
  permalink,
};
