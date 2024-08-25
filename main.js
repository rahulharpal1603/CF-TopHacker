let data, result;
const contestId = 2000;
const OKVerdict = "HACK_SUCCESSFUL";
const NOKVerdict = "HACK_UNSUCCESSFUL";
async function getHacks() {
    let response = await fetch(`https://codeforces.com/api/contest.hacks?contestId=${contestId}&asManager=false`);
    data = await response.json();
    if (data.status === "OK")
        return data.result;
    else
        return "FAILED";
}
async function getProblemIndices() {
    let response = await fetch(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
    data = await response.json();
    let probObj = data.result.problems;
    let probIndices = [];
    for (let i = 0; i < probObj.length; i++) {
        probIndices.push(probObj[i].index);
    }
    if (data.status === "OK")
        return probIndices;
    else
        return "FAILED";
}
async function getUserRatings(hackers) {
    let handleArr = [];
    for (let i = 0; i < hackers.length; i++) {
        handleArr.push(hackers[i].handle);
    }
    let handles = handleArr.join(';');
    let response = await fetch(`https://codeforces.com/api/user.info?handles=${handles}&checkHistoricHandles=false`);
    data = await response.json();
    data = data.result;
    for (let i = 0; i < data.length; i++) {
        hackers[i].rating = data[i].rank;
    }
}
async function extractInfo() {
    let response = await getHacks();
    let probIndices = await getProblemIndices();
    let hackers = {};
    if (response != "FAILED" && probIndices != "FAILED") {
        for (let i = 0; i < response.length; i++) {
            let hack = response[i];
            if (hack.hasOwnProperty('verdict') && (hack.verdict === OKVerdict || hack.verdict === NOKVerdict)) {
                let handle = hack.hacker.members[0].handle;
                let probIndex = hack.problem.index;
                if(!hackers.hasOwnProperty(handle))
                {
                    let objTemplate = {handle : handle,totalSuccess: 0, totalFail: 0};
                    for (let i = 0; i < probIndices.length; i++) {
                        objTemplate[probIndices[i]] = { successCount: 0, failCount: 0 };
                    }
                    hackers[handle] = objTemplate;
                }
                if (hack.verdict === OKVerdict) {
                    hackers[handle][probIndex].successCount++;
                    hackers[handle].totalSuccess++;
                }
                else if (hack.verdict === NOKVerdict) {
                    hackers[handle][probIndex].failCount++;
                    hackers[handle].totalFail++;
                }
            }
        }
        let hackerArray = Object.values(hackers);
        hackerArray.sort((a, b) => {return b.totalSuccess - a.totalSuccess});
        await getUserRatings(hackerArray);
        for(let i=0;i<10;i++)
        {
            console.log(hackerArray[i]);
        }
        // console.log(hackerArray);
        return hackerArray
        // console.log(hackerArray);
        // console.log(hackers["RahulHarpal"]);
        // console.log(hackers["djm03178"]);
    }
    else
    {
        return "FAILED";
    }

}

extractInfo();