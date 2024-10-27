import { GraphQLClient } from "graphql-request";

function getCaesarClient(env) {
  switch (env) {
    case "production": {
      return new GraphQLClient("https://caesar.zooniverse.org/graphql");
    }
    default: {
      return new GraphQLClient("https://caesar-staging.zooniverse.org/graphql");
    }
  }
}

const caesarClient = getCaesarClient("production");

function constructCoordinates(line) {
  if (line && line.clusters_x && line.clusters_y) {
    return line.clusters_x.map((point, i) => ({
      x: line.clusters_x[i],
      y: line.clusters_y[i],
    }));
  }
  return [];
}

function constructText(line) {
  const sentences = [];
  if (line && line.clusters_text) {
    line.clusters_text.forEach((value) => {
      value.forEach((word, i) => {
        if (!sentences[i]) {
          sentences[i] = [];
        }
        if (word && word.length) {
          sentences[i].push(word);
        }
      });
    });
  }
  return sentences.map((value) => value.join(" "));
}

function constructLine(reduction, options) {
  const { frame, minimumViews, threshold } = options;
  const consensusText = reduction.consensus_text;
  const points = constructCoordinates(reduction);
  const textOptions = constructText(reduction);
  return {
    consensusReached:
      reduction.consensus_score >= threshold ||
      reduction.number_views >= minimumViews,
    consensusText,
    frame,
    id: reduction.id,
    points,
    textOptions,
  };
}

/**
Generate an array of consensus lines for a single frame.
*/
function frameConsensus(line, options) {
  if (!line.id) {
    line.id = "this is a stub";
  }
  return constructLine(line, options);
}

/**
Generate an array of consensus lines for a single reduction and frame.
*/
function reductionConsensus(reduction, frame) {
  const { parameters } = reduction.data;
  const currentFrameReductions = reduction.data[`frame${frame}`] || [];
  const options = {
    frame,
    minimumViews: parameters?.minimum_views || DEFAULT_VIEWS_TO_RETIRE,
    threshold:
      parameters?.low_consensus_threshold || DEFAULT_CONSENSUS_THRESHOLD,
  };
  return currentFrameReductions.map((line) => frameConsensus(line, options));
}

function consensusLines(reductions, frame = 0) {
  return reductions
    .map((reduction) => reductionConsensus(reduction, frame))
    .flat();
}

const HTMLTags = {
  superscript: "sup",
  subscript: "sub",
  underline: "u",
  deletion: "del",
  insertion: "ins",
  unclear: "mark",
};

/**
 * Rewrite [tag] text fragment[/tag] as a HTML fragment.
 * eg. 28[superscript]th[/superscript] becomes 28<sup>th</sup>.
 * @param {string} match the full matched string.
 * @param {string} p1 the opening tag.
 * @param {string} p2 tagged text fragment.
 * @param {string} p3 the closing tag.
 * @returns A HTML string, or the original string if the matched tags are invalid.
 */
function replaceTags(match, p1, p2, p3) {
  const tag = HTMLTags[p1];
  if (tag && p1 === p3) {
    if (tag === "mark") {
      return `<mark class="${p1}">${p2 || "…"}</mark>`;
    }
    return `<${tag}>${p2}</${tag}>`;
  }
  return match;
}

/**
 * Escape special characters in a regular expression.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#escaping
 * @param {string} string 
 * @returns string with special characters escaped.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * Match tagged snippets of the form [tagName]text fragment[/tagName], including empty tags.
 * @param {string} tagName
 * @returns a regular expression to match a tagged text snippet.
 */
function taggedTextMatcher(tagName) {
  const punctuationMatcher = String.raw`${escapeRegExp('.,;:?`\'"!()-+*=&%º')}`;
  const nestedTagMatcher = String.raw`${escapeRegExp('[]<>/')}`;
  const textFragmentMatcher = String.raw`[\w\d\s${punctuationMatcher}${nestedTagMatcher}]`;
  return new RegExp(
    String.raw`\[(${tagName})\](${textFragmentMatcher}*?)\[\/(${tagName})\]`,
    "g"
  );
}

async function fetchReductions(workflowID, subjectID, frames) {
  const query = `{
    workflow(id: ${workflowID}) {
      subject_reductions(subjectId: ${subjectID}, reducerKey:"alice")
      {
        data
      }
    }
  }`;
  const response = await caesarClient.request(query.replace(/\s+/g, " "));
  const consensus = [];
  for (let frame = 0; frame < frames; frame++) {
    const framePages = [
      [],
      [],
    ];
    const sortedLines = consensusLines(response.workflow.subject_reductions, frame)
    .sort((a, b) => a.points[0].y - b.points[0].y);
    const maxX = Math.max(...sortedLines.map((line) => line.points[1].x)) + 20;
    sortedLines.forEach((line) => {
      const pageIndex = line.points[0].x < maxX / 2 ? 0 : 1;
      framePages[pageIndex].push(line);
    });
    framePages.forEach((page) => {
      consensus.push(
        page
          .map((line) => `<span class="line">${line.consensusText}</span>`)
          .join("<br>")
      );
    });
  }

  const transcription = consensus
    .filter(Boolean)
    .join("<br><br>")
    .replaceAll(taggedTextMatcher("superscript"), replaceTags)
    .replaceAll(taggedTextMatcher("subscript"), replaceTags)
    .replaceAll(taggedTextMatcher("underline"), replaceTags)
    .replaceAll(taggedTextMatcher("deletion"), replaceTags)
    .replaceAll(taggedTextMatcher("insertion"), replaceTags)
    .replaceAll(taggedTextMatcher("unclear"), replaceTags);
  document.getElementById("page-transcription").innerHTML = transcription;
}

window.fetchReductions = fetchReductions;
