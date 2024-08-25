chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHacksStandings") {
        // console.log("Received request to get hacks standings for contest", request.contestId);
        getHacksStandings(request.contestId).then(sendResponse);
        return true;  // Indicates we will send a response asynchronously
    }
});

async function getHackTable(url) {
    try {
        let response = await fetch(url)
        response = await response.text();
        return { html: response };
    }
    catch (error) {
        return { error: error.toString() };
    }
}
async function getProblemIndices(contestId) {
    try {
        let response = await fetch(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
        let data = await response.json();
        let probObj = data.result.problems;
        if (data.status === "OK") {
            let probIndices = [];
            for (let i = 0; i < probObj.length; i++) {
                probIndices.push(probObj[i].index);
            }
            return { arr: probIndices };
        }
        else {
            throw new Error("Failed to fetch problem indices");
        }
    }
    catch (error) {
        return { error: error.toString()};
    }
}
async function getHacksStandings(contestId) {
    //Some constants
    const url = `https://codeforces.com/contest/${contestId}/hacks?showAll=true`;
    
    //Sending Requests to fetch data
    let hackTable = await getHackTable(url);
    let probIndices = await getProblemIndices(contestId);

    
    //Checking for errors
    if (hackTable.hasOwnProperty('error')) {
        return {error:response.error};
    }
    else if (probIndices.hasOwnProperty('error')) {
        return {error: probIndices.error};
    }
    else {
        try{
            return {hackTable: hackTable, probIndices: probIndices.arr};
        }
        catch(error){
            return {error: error.toString()};
        }
        // const doc = parser.parseFromString(hackTable.html, 'text/html');
        // const hackTableBody = doc.querySelector('.challenges-frame-datatable tbody');
        // if (!hackTableBody) {
        //     return {error: errorMessage};
        // }
        // else {
        //     //Initialising variables
        //     let hackers = {};
        //     const children = hackTableBody.children;
        //     let hacksPresent = false;
        //     return {res: children};
        //     for (let i = 0; i < children.length; i++) {
        //         const row = children[i];
        //         if (row.attributes.hasOwnProperty('challengeid')) {
        //             hacksPresent = true;
        //             const rowChildren = row.children;
        //             const userInfo = rowChildren[2].querySelector("a").attributes['title'].value.trim().split(' ');
        //             const userHandle = userInfo[1].trim();
        //             const userRank = userInfo[0].trim();
        //             const problem = rowChildren[4].querySelector("a").innerHTML.trim().split(' ')[0].trim();
        //             const verdict = rowChildren[6].querySelector("span").innerHTML.trim().split(' ')[0].trim();
        //             if(verdict === OKVerdict || verdict === NOKVerdict){
        //                 if(!hackers.hasOwnProperty(userHandle)){
        //                     hackers[userHandle] = {};
        //                     let objTemplate = { handle: userHandle, rank: userRank,totalSuccess: 0, totalFail: 0 };
        //                     for (let i = 0; i < probIndices.length; i++) {
        //                         objTemplate[probIndices[i]] = { successCount: 0, failCount: 0 };
        //                     }
        //                     hackers[userHandle] = objTemplate;
        //                 }
        //                 if (verdict === OKVerdict) {
        //                     hackers[userHandle][problem].successCount++;
        //                     hackers[userHandle].totalSuccess++;
        //                 }
        //                 else if (verdict === NOKVerdict) {
        //                     hackers[userHandle][problem].failCount++;
        //                     hackers[userHandle].totalFail++;
        //                 }
        //             }
        //             hackerArray = Object.values(hackers);
        //             hackerArray.sort((a, b) => b.totalSuccess - a.totalSuccess);
        //             return hackerArray;
        //         }
        //     }
        //     if(!hacksPresent){
        //         return {error: errorMessage};
        //     }
        // }
    }
    
}


// async function getHacks() {
    //     let response = await fetch(`https://codeforces.com/api/contest.hacks?contestId=${contestId}&asManager=false`);
    //     let data = await response.json();
    //     if (data.status === "OK")
    //         return data.result;
    //     else
    //         return "FAILED";
    // }
    
    // async function getUserRatings(hackers) {
        //     let handleArr = [];
        //     for (let i = 0; i < hackers.length; i++) {
            //         handleArr.push(hackers[i].handle);
            //     }
//     let response = await fetch(`https://codeforces.com/api/user.info?handles=${handleArr.join(';')}&checkHistoricHandles=false`);
//     data = await response.json();
//     data = data.result;
//     for (let i = 0; i < data.length; i++) {
    //         hackers[i].rating = data[i].rank;
    //     }
    // }
    
    
    
    
    // if (response != "FAILED" && probIndices != "FAILED") {
        //     for (let i = 0; i < response.length; i++) {
//         let hack = response[i];
//         if (hack.hasOwnProperty('verdict') && (hack.verdict === OKVerdict || hack.verdict === NOKVerdict)) {
    //             let handle = hack.hacker.members[0].handle;
    //             let probIndex = hack.problem.index;
    //             if (!hackers.hasOwnProperty(handle)) {
        //                 let objTemplate = { handle: handle, totalSuccess: 0, totalFail: 0 };
        //                 for (let i = 0; i < probIndices.length; i++) {
            //                     objTemplate[probIndices[i]] = { successCount: 0, failCount: 0 };
            //                 }
            //                 hackers[handle] = objTemplate;
            //             }
            //             if (hack.verdict === OKVerdict) {
                //                 hackers[handle][probIndex].successCount++;
                //                 hackers[handle].totalSuccess++;
                //             }
                //             else if (hack.verdict === NOKVerdict) {
                    //                 hackers[handle][probIndex].failCount++;
                    //                 hackers[handle].totalFail++;
                    //             }
                    //         }
                    //     }
                    //     let hackerArray = Object.values(hackers);
                    //     hackerArray.sort((a, b) => b.totalSuccess - a.totalSuccess);
                    //     await getUserRatings(hackerArray);
                    //     console.log(hackerArray.length);
                    //     return hackerArray;
                    // }
                    // else {
                        //     return "FAILED";
                        // }


                        
                        // for (let i = 0; i < response.length; i++) {
                        //     let hack = response[i];
                        //     if (hack.hasOwnProperty('verdict') && (hack.verdict === OKVerdict || hack.verdict === NOKVerdict)) {
                        //         let handle = hack.hacker.members[0].handle;
                        //         let probIndex = hack.problem.index;
                        //         if (!hackers.hasOwnProperty(handle)) {
                        //             let objTemplate = { handle: handle, totalSuccess: 0, totalFail: 0 };
                        //             for (let i = 0; i < probIndices.length; i++) {
                        //                 objTemplate[probIndices[i]] = { successCount: 0, failCount: 0 };
                        //             }
                        //             hackers[handle] = objTemplate;
                        //         }
                        //         if (hack.verdict === OKVerdict) {
                        //             hackers[handle][probIndex].successCount++;
                        //             hackers[handle].totalSuccess++;
                        //         }
                        //         else if (hack.verdict === NOKVerdict) {
                        //             hackers[handle][probIndex].failCount++;
                        //             hackers[handle].totalFail++;
                        //         }
                        //     }
                        // }
                        // let hackerArray = Object.values(hackers);
                        // hackerArray.sort((a, b) => b.totalSuccess - a.totalSuccess);
                        // await getUserRatings(hackerArray);
                        // console.log(hackerArray.length);
                        // return hackerArray;