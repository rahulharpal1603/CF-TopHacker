chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getHacksStandings") {
    // console.log("Received request to get hacks standings for contest", request.contestId);
    getHacksStandings(request.contestId).then(sendResponse);
    return true; // Indicates we will send a response asynchronously
  }
});

async function getHackTable(url) {
  try {
    let response = await fetch(url);
    response = await response.text();
    return { html: response };
  } catch (error) {
    return { error: error.toString() };
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
        probIndices.push(probObj[i].index);
      }
      return { arr: probIndices };
    } else {
      throw new Error("Failed to fetch problem indices");
    }
  } catch (error) {
    return { error: error.toString() };
  }
}
async function getHacksStandings(contestId) {
  //Some constants
  const url = `https://codeforces.com/contest/${contestId}/hacks?showAll=true`;

  //Sending Requests to fetch data
  let hackTable = await getHackTable(url);
  let probIndices = await getProblemIndices(contestId);

  //Checking for errors
  if (hackTable.hasOwnProperty("error")) {
    return { error: response.error };
  } else if (probIndices.hasOwnProperty("error")) {
    return { error: probIndices.error };
  } else {
    try {
      return { hackTable: hackTable, probIndices: probIndices.arr };
    } catch (error) {
      return { error: error.toString() };
    }
  }
}
