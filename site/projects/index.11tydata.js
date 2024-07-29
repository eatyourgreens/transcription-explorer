function titlePages({ config, project, subjects, subjectSets }) {
  function titlePage(subjectSet) {
    return {
      href: `${config.siteRoot}/${project.slug}/subjectSets/${subjectSet.id}`,
      title: subjectSet.display_name,
      subjectCount: subjectSet.set_member_subjects_count
    }
  }

  return subjectSets
    .filter(subjectSet => subjectSet.links.project === project.id)
    .map(titlePage).filter(Boolean)
}

export default {
  eleventyComputed: {
    titlePages
  }
}