(function () {
  const colors = { "Unrated,": "#000000","Newbie": "#808080", "Pupil": "#008000", "Specialist": "#03a89e", "Expert": "#0000ff", "Candidate Master": "#aa00aa", "Master": "#ff8c00", "International Master": "#ff8c00", "Grandmaster": "#ff0000", "International Grandmaster": "#ff0000", "Legendary Grandmaster": "#ff0000" };
  const standingsTable = document.querySelector('.datatable');
  const pagination = document.querySelector('.custom-links-pagination');
  const parentNode = document.querySelector('#pageContent');
  let count = 1;



  function createButton() {
    const list = document.querySelector('.second-level-menu');
    const ul = document.createElement('ul');
    ul.className = 'second-level-menu-list';
    list.appendChild(ul);
    ul.innerHTML += `<li class="noLava"><a>|</a></li>`;
    ul.innerHTML += `<li><a href="#">Hacks Standings</a></li>`;
    ul.lastChild.addEventListener('click', getAndInsertTable);
  }

  function parseResponse(response) {
    const errorMessage = "Hacks Data not found";
    const OKVerdict = "Successful";
    const NOKVerdict = "Unsuccessful";
    hackTable = response.hackTable;
    probIndices = response.probIndices;
    const parser = new DOMParser();
    const doc = parser.parseFromString(hackTable.html, 'text/html');
    const hackTableBody = doc.querySelector('.challenges-frame-datatable tbody');
    if (!hackTableBody) {
      return { error: errorMessage };
    }
    else {
      //Initialising variables
      let hackers = {};
      const rowsArray = hackTableBody.children;
      let hacksPresent = false;
      console.log(rowsArray.length);
      if (rowsArray.length === 0) {
        return { error: errorMessage };
      }
      for (let i = 0; i < rowsArray.length; i++) {
        const row = rowsArray[i];
        if (row.attributes.hasOwnProperty('challengeid')) {
          hacksPresent = true;
          let rowChildren = row.children;
          let userInfo = rowChildren[2].querySelector("a").attributes['title'].value.trim().split(' ');
          let userRank;
          let userHandle;
          if (userInfo.length === 3) {
            userRank = `${userInfo[0].trim()} ${userInfo[1].trim()}`;
            userHandle = userInfo[2].trim();
          }
          else {
            userRank = userInfo[0].trim();
            userHandle = userInfo[1].trim();
          }
          let problem = rowChildren[4].querySelector("a").innerHTML.trim().split(' ')[0].trim();
          let verdict = rowChildren[6].querySelector("span").innerHTML.trim().split(' ')[0].trim();
          // console.log(userHandle, userRank, problem, verdict);

          if (verdict === OKVerdict || verdict === NOKVerdict) {
            if (!hackers.hasOwnProperty(userHandle)) {
              hackers[userHandle] = {};
              let objTemplate = { handle: userHandle, rank: userRank, totalSuccess: 0, totalFail: 0 };
              for (let i = 0; i < probIndices.length; i++) {
                objTemplate[probIndices[i]] = { successCount: 0, failCount: 0 };
              }
              hackers[userHandle] = objTemplate;
            }
            if (verdict === OKVerdict) {
              hackers[userHandle][problem].successCount++;
              hackers[userHandle].totalSuccess++;
            }
            else if (verdict === NOKVerdict) {
              hackers[userHandle][problem].failCount++;
              hackers[userHandle].totalFail++;
            }
          }
        }
      }
      if (!hacksPresent) {
        return { error: errorMessage };
      }
      hackerArray = Object.values(hackers);
      hackerArray.sort((a, b) => b.totalSuccess - a.totalSuccess);
      // console.log(hackerArray);
      return { arr: hackerArray };
    }

  }

  function loader() {
    let target = parentNode.lastChild;
    if (count % 3 === 0)
      target.textContent = "Fetching data, please wait  |"
    else if (count % 3 === 1)
      target.textContent = "Fetching data, please wait  /"
    else
      target.textContent = "Fetching data, please wait  -"
    count++;
    
  }
  function getAndInsertTable(event) {
    const existingTable = document.getElementById('hacksStandingsTable');
    if(existingTable)
    {
      return;
    }
    if (standingsTable)
      standingsTable.remove();
    if (pagination)
      pagination.remove();
    let newParagraph;
    if (!document.querySelector('.HacksLoader')) {
      newParagraph = document.createElement('p');
      newParagraph.className = 'HacksLoader';
      newParagraph.textContent = "Fetching data, please wait  |";
      newParagraph.style.fontFamily = 'Helvetica';
      newParagraph.style.fontWeight = '500';
      newParagraph.style.fontSize = '18px';
      newParagraph.style.textAlign = 'center';
      parentNode.appendChild(newParagraph);
    }
    let loadingSign = setInterval(loader, 150);
    const contestId = window.location.pathname.split('/')[2];
    console.log(contestId);
    chrome.runtime.sendMessage({ action: "getHacksStandings", contestId: contestId }, (response) => {
      if (response) {
        clearInterval(loadingSign);
        if (newParagraph) {
        newParagraph.remove();
        if (response.hasOwnProperty('error')) {
          alert("Failed to fetch hacks standings data.\n" + response.error);
        }
        else {
          // console.log(response);
          parsingResult = parseResponse(response);
          if (parsingResult.hasOwnProperty('error')) {
            alert(parsingResult.error);
          }
          else {
            insertTable(parsingResult.arr,response.probIndices,contestId);
          }
        }
        }
      }
    });
  }

  function insertTable(hackerArray, probIndices,contestId) {




    const table = document.createElement('table');
    table.id = 'hacksStandingsTable';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '20px';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const headers = ['Rank', 'User', 'Hacks : Fails'];
    probIndices.forEach(index => {index = index.toUpperCase(); headers.push(index)});
    headers.forEach((headerText,index) => {
      const th = document.createElement('th');
      if(index >= 3)
      {
        th.innerHTML = `<a href="https://codeforces.com/contest/${contestId}/problem/${headerText}">${headerText}</a>`;
      }
      else
      {
        th.innerHTML = headerText;
      }
      th.style.border = '1px solid #ddd';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f2f2f2';
      th.style.textAlign = 'center';
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    hackerArray.forEach((hacker, index) => {
      const rank = hacker.rank;
      // const rank = "newbie";
      // console.log(hacker);

      const row = tbody.insertRow();
      const cells = [
        index + 1,
        hacker.handle,
        [hacker.totalSuccess,hacker.totalFail]
      ];
      probIndices.forEach(index => {
        index = index.toUpperCase();
        cells.push([hacker[index].successCount,hacker[index].failCount]);
      });
      cells.forEach((value, index) => {
        const cell = row.insertCell();
        if (index === 1) {
          cell.innerHTML = `<a style ="font-family: Helvetica;font-weight:700;text-decoration:none; color:${colors[rank]}" href="https://codeforces.com/profile/${hacker.handle}" target="_blank">${hacker.handle}</a>`;
        }
        else if(index >= 2)
        {
          if(value[0] === 0 && value[1] === 0)
          {
            cell.innerHTML = `-`;
          }
          else
          {
            cell.innerHTML = `<span style = "color: green">+${value[0]}</span> : <span style = "color: red">-${value[1]}</span>`;
          }
        }
        else
        {
          cell.textContent = value;
        }
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
        cell.style.textAlign = 'center';
      });
    });

    if (parentNode) {
      parentNode.appendChild(table);
    }
  }

  createButton();
})();


