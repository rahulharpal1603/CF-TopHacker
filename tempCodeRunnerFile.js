async function getUserRatings(hackers) {
    let handleArr = [];
    for (let i = 0; i < hackers.length; i++) {
        handleArr.push(hackers[i].handle);
    }
    let response = await fetch(`https://codeforces.com/api/user.info?handles=${handleArr.join(';')}&checkHistoricHandles=false`);
    data = await response.json();
    data = data.result;
    for (let i = 0; i < data.length; i++) {
        hackers[i].rating = data[i].rank;
    }
}