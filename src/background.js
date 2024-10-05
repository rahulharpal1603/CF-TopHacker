importScripts("Cache.js");
CACHE = new Cache();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getHacksStandings") {
    getHacksStandings(request.contestId).then(sendResponse);
    return true; // Indicates we will send a response asynchronously
  }
});

async function getHackTable(url) {
  try {
    let response = await fetch(url);
    response = await response.text();
    return { html: response }; // Return the HTML content of the fetched URL
  } catch (error) {
    return { error: error.toString() }; // Return an error message if the fetch fails
  }
}

async function getProblemIndices(contestId) {
  try {
    let response = await fetch(
      `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`
    );
    let data = await response.json();
    let probObj = data.result.problems;
    if (data.status === "OK") {
      let probIndices = [];
      for (let i = 0; i < probObj.length; i++) {
        probIndices.push(probObj[i].index); // Collect problem indices
      }
      return { arr: probIndices }; // Return an object of the form { arr: [problem indices] }
    } else {
      throw new Error("Failed to fetch problem indices");
    }
  } catch (error) {
    return { error: error.toString() }; // Return an object with an error message
  }
}

async function getHacksStandings(contestId) {
    return CACHE.getOr( contestId ,  async () => {
    // URL to fetch hacks standings
    const url = `https://codeforces.com/contest/${contestId}/hacks?showAll=true`;

    // Fetch the hack table HTML content
    let hackTable = await getHackTable(url);
    // Fetch the problem indices for the contest
    let probIndices = await getProblemIndices(contestId);

    // Check for errors in the fetched data
    if (hackTable.hasOwnProperty("error")) {
      return { error: hackTable.error }; // Hack Table doesn't exist
    } else if (probIndices.hasOwnProperty("error")) {
      return { error: probIndices.error }; // Could Not Fetch Problem Indices from CF API
    } else {
      try {
        // Return the fetched hack table and problem indices
        return { hackTable: hackTable, probIndices: probIndices.arr };
      } catch (error) {
        return { error: error.toString() }; // Return an object with an error message
      }
    }
} )  }
