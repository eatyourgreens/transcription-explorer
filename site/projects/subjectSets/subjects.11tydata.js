function subjectSet({ subjectsPage }) {
  return subjectsPage.set;
}

function subjectsPageTitle({ subjectsPage }) {
  return `${subjectsPage.set?.display_name} Page ${subjectsPage.page}`;
}

function subjectsPageDescription({ subjectsPage }) {
  return `Pages from ${subjectsPage.set?.display_name}`;
}

function project({ subjectsPage, projects }) {
  const subject = subjectsPage.subjects[0];
  const projectID = subject.links.project;
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

function thumbnails({ config, projects, subjectsPage }) {
  const currentProject = project({ subjectsPage, projects });
  return subjectsPage.subjects.map((subject) => {
    const [firstImage] = subject.locations;
    return {
      href: `${config.siteRoot}/${currentProject.slug}/subjects/${subject.id}/`,
      alt: `Subject ${subject.id}`,
      src: thumbnail(firstImage["image/jpeg"]),
    };
  });
}

function subjectsPageImage({ subjectsPage }) {
  const [subject] = subjectsPage.subjects;
  return thumbnail(subject.locations[0]["image/jpeg"]);
}

function permalink({ projects, subjectsPage }) {
  const currentProject = project({ subjectsPage, projects });
  if (subjectsPage.page === 1) {
    return `/${currentProject.slug}/subjectSets/${subjectsPage.set.id}/`;
  }
  return `/${currentProject.slug}/subjectSets/${subjectsPage.set.id}/page/${subjectsPage.page}/`;
}

export default {
  eleventyComputed: {
    subjectSet,
    title: subjectsPageTitle,
    description: subjectsPageDescription,
    ogImage: subjectsPageImage,
    project,
    thumbnails,
  },
  permalink,
};
