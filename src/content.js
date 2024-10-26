(function () {
  //mapping between user ranks and their corresponding colors

const colors = {
  "Unrated,": "#000000",
  "Не рейтинге,": "#000000",
  Newbie: "#808080",
  Новичок: "#808080",
  Pupil: "#008000",
  Ученик: "#008000",
  Specialist: "#03a89e",
  Специалист: "#03a89e",
  Expert: "#0000ff",
  Эксперт: "#0000ff",
  "Candidate Master": "#aa00aa",
  "Кандидат мастера": "#aa00aa",
  Master: "#ff8c00",
  Мастер: "#ff8c00",
  "International Master": "#ff8c00",
  "Международный мастер": "#ff8c00",
  Grandmaster: "#ff0000",
  Гроссмейстер: "#ff0000",
  "International Grandmaster": "#ff0000",
  "Международный гроссмейстер": "#ff0000",
  "Legendary Grandmaster": "#ff0000",
  "Легендарный гроссмейстер": "#ff0000",
  Tourist: "#000000",
  Туристический: "#000000",
};


  // Select various elements from the DOM that will be removed/modified
  const standingsTable = document.querySelector(".datatable");
  const pagination = document.querySelector(".custom-links-pagination");
  const parentNode = document.querySelector("#pageContent");
  const showUnofficialToggle = document.querySelector(
    ".toggle-show-unofficial"
  );
  const contestStatus = document.querySelector(".contest-status");
  let count = 1; // for loader animation

  //Function to remove the existing hover effect from the menu items, which will be reapplied later
  function processMenuList(selector) {
    const ul = document.querySelector(selector);
    if (!ul) return "";

    let result = '<ul class="second-level-menu-list">';

    const listItems = ul.children;
    for (let li of listItems) {
      const a = li.querySelector("a");
      if (a) {
        let classAttribute = "";
        if (a.innerHTML.trim() === "|")
          //To prevent lavaLamp effect on pipe
          classAttribute = 'class="noLava"';
        result += `<li ${classAttribute}>  ${a.outerHTML}  </li>`;
      }
    }

    result += "</ul>";
    return result;
  }

  //Function to create a new button for "Hacks Standings" in the menu
  function createButton() {
    const parent = document.querySelector(".second-level-menu");
    const defaultButtons = processMenuList(".second-level-menu-list");
    parent.innerHTML = defaultButtons;
    const pipe = document.createElement("li");
    const HacksButton = document.createElement("li");
    pipe.className = "noLava"; // Prevent lavaLamp effect on the pipe (|) character
    pipe.innerHTML = `<a>|</a>`;
    HacksButton.innerHTML = `<a href="#">Hacks Standings</a>`;
    const list = document.querySelector(".second-level-menu-list");
    list.appendChild(pipe);
    list.appendChild(HacksButton);
    list.lastChild.addEventListener("click", getAndInsertTable);
  }

  //Function to parse the response received from the CF Server (response is generated by background.js script)
  function parseResponse(response) {
    const errorMessage = "Hacks Data not found";
    const OKVerdict = "Successful";
    const NOKVerdict = "Unsuccessful";
    hackTable = response.hackTable;
    probIndices = response.probIndices;
    const parser = new DOMParser();
    const doc = parser.parseFromString(hackTable.html, "text/html");
    const hackTableBody = doc.querySelector(
      ".challenges-frame-datatable tbody"
    );
    if (!hackTableBody) {
      return { error: errorMessage };
    } else {
      //Initialising variables
      let hackers = {};
      // Map hacker handle to hack details
      let hackDetails = new Map();
      const rowsArray = hackTableBody.children;
      let hacksPresent = false;
      if (rowsArray.length === 0) {
        return { error: errorMessage };
      }
      //Iterating over each row of the table and extracting the required information
      //Each row looks like this: 0:ChallengeID | 1:When | 2:Hacker | 3:Defender | 4:Problem | 5:Test | 6:Verdict
      for (let i = 0; i < rowsArray.length; i++) {
        const row = rowsArray[i];
        if (row.attributes.hasOwnProperty("challengeid")) {
          hacksPresent = true;
          let rowChildren = row.children;
          let challengeId = row.attributes["challengeid"].value;
          let date = rowChildren[1].innerHTML.trim();
          let userInfo = rowChildren[2]
            .querySelector("a")
            .attributes["title"].value.trim()
            .split(" ");
          let userRank;
          let userHandle;
          if (userInfo.length === 3) {
            //Case where user has ranks: CM,IM,IGM,LGM
            userRank = `${userInfo[0].trim()} ${userInfo[1].trim()}`;
            // userHandle = userInfo[2].trim();
          } else if (userInfo.length === 4) {
            //Case where user has ranks: CM,IM,IGM,LGM and language is Russian
            userRank = `${userInfo[0].trim()} ${userInfo[2].trim()}`;

          }else {
            //Case where user has ranks: Unrated, Newbie, Pupil, Specialist, Expert, Master and Tourist

            userRank = userInfo[0].trim();
          }
          userHandle = userInfo[userInfo.length - 1].trim();
          let problem = rowChildren[4]
            .querySelector("a")
            .innerHTML.trim()
            .split(" ")[0]
            .trim();
          let full_verdict = rowChildren[6]
            .querySelector("span")
            .innerHTML.trim();
          let verdict = full_verdict.split(" ")[0].trim();
          //"Неудачная"==Unsuccessful
          //Успешный==Successfull
          if (
            verdict === OKVerdict ||
            verdict === NOKVerdict ||
            verdict === "Неудачная" ||
            verdict === "Успешный"
          ) {
            if (!hackers.hasOwnProperty(userHandle)) {
              //Initialising the object for each hacker only if the hacker is not already present in the hackers object
              hackers[userHandle] = {};
              hackDetails[userHandle] = {};
              let objTemplate = {
                handle: userHandle,
                rank: userRank,
                totalSuccess: 0,
                totalFail: 0,
              };
              for (let i = 0; i < probIndices.length; i++) {
                objTemplate[probIndices[i]] = { successCount: 0, failCount: 0 };
              }
              hackers[userHandle] = objTemplate;
            }
            if (verdict === OKVerdict || verdict === "Успешный") {
              hackers[userHandle][problem].successCount++;
              hackers[userHandle].totalSuccess++;
              hackDetails[userHandle][problem] =
                hackDetails[userHandle][problem] || [];
              hackDetails[userHandle][problem].push({
                date: date,
                verdict: full_verdict,
                id: challengeId,
              });
            } else if (verdict === NOKVerdict || verdict === "Неудачная") {
              hackers[userHandle][problem].failCount++;
              hackers[userHandle].totalFail++;
              hackDetails[userHandle][problem] =
                hackDetails[userHandle][problem] || [];
              hackDetails[userHandle][problem].push({
                date: date,
                verdict: full_verdict,
                id: challengeId,
              });
            }
          }
        }
      }
      if (!hacksPresent) {
        return { error: errorMessage }; //No rows found for hacks
      }
      hackerArray = Object.values(hackers);

      //Sorting the hackerArray based on the total number of successful hacks, if the total number of successful hacks are equal, then sorting based on the total number of unsuccessful hacks but in reverse.
      hackerArray.sort((a, b) => {
        if (b.totalSuccess !== a.totalSuccess) {
          return b.totalSuccess - a.totalSuccess;
        } else if (b.totalFail !== a.totalFail) {
          return a.totalFail - b.totalFail;
        } else {
          return a.handle.localeCompare(b.handle);
        }
      });
      return { arr: hackerArray, hackDetails: hackDetails };
    }
  }

  function loaderFunc() {
    let target = parentNode.lastChild;
    if (count % 3 === 0) {
      target.textContent = "Fetching data, please wait  |";
    } else if (count % 3 === 1) {
      target.textContent = "Fetching data, please wait  /";
    } else {
      target.textContent = "Fetching data, please wait  -";
    }
    count = (count + 1) % 3;
  }

  let alreadyRunning = false;
  function getAndInsertTable(event) {
    if (alreadyRunning) {
      return;
    }
    alreadyRunning = true;
    console.log("Fetching Hacks Standings");
    const existingTable = document.getElementById("hacksStandingsTable");
    if (existingTable) {
      //Remove the existing table if it is present, to refresh the hacks standings
      existingTable.remove();
    }
    //Removing other elements from the DOM
    if (standingsTable) {
      standingsTable.remove();
    }
    if (pagination) {
      pagination.remove();
    }
    if (showUnofficialToggle && showUnofficialToggle.parentNode) {
      showUnofficialToggle.parentNode.remove();
    }
    if (contestStatus) {
      contestStatus.innerHTML = "Hacks Standings";
    }
    let loader;
    if (!document.querySelector(".HacksLoader")) {
      loader = document.createElement("p");
      loader.className = "HacksLoader";
      loader.textContent = "Fetching data, please wait  |";
      loader.style.fontFamily = "Helvetica";
      loader.style.fontWeight = "500";
      loader.style.fontSize = "18px";
      loader.style.textAlign = "center";
      parentNode.appendChild(loader);
    }
    let loadingSign = setInterval(loaderFunc, 150);

    const contestId = window.location.pathname.split("/")[2]; //Extracting the contestId from the URL

    //Sending a message to the background.js file to fetch the HTML file for the hacks page (Only one request is needed to fetch the hacks page)
    chrome.runtime.sendMessage(
      { action: "getHacksStandings", contestId: contestId },
      (response) => {
        if (response) {
          clearInterval(loadingSign); //Stop the loader animation
          if (loader) {
            loader.remove(); //Remove the loader element
          }
          if (response.hasOwnProperty("error")) {
            alert("Failed to fetch hacks standings data.\n" + response.error);
          } else {
            parsingResult = parseResponse(response);
            if (parsingResult.hasOwnProperty("error")) {
              alert(parsingResult.error);
            } else {
              const hacksWindow = new HacksWindow(
                parsingResult.hackDetails,
                contestId
              );
              insertTable(
                parsingResult.arr,
                response.probIndices,
                contestId,
                hacksWindow
              );
            }
          }
        }
        alreadyRunning = false;
      }
    );
  }
  function insertLastRow(totals, tbody) {
    const totalRow = tbody.insertRow();
    let totalCell = totalRow.insertCell();
    totalCell.textContent = "Total Hacks";
    totalCell.style.border = "1px solid #ddd";
    totalCell.style.padding = "8px";
    totalCell.style.textAlign = "center";
    totalCell.style.fontWeight = "bold";
    totalCell.style.backgroundColor = "#f2f2f2";
    totalCell.colSpan = 2;
    for (let i = 0; i < totals.length; i++) {
      totalCell = totalRow.insertCell();
      const successCount = totals[i].success;
      const failCount = totals[i].fail;
      if (successCount === 0 && failCount === 0) {
        totalCell.innerHTML = `-`;
      } else {
        totalCell.innerHTML = `<span style = "color: green" title = "Successful hacking attempts">+${successCount}</span> <br> <span style = "color: red" title = "Unsuccessful hacking attempts">-${failCount}</span>`;
      }
      totalCell.style.border = "1px solid #ddd";
      totalCell.style.padding = "8px";
      totalCell.style.textAlign = "center";
      totalCell.style.fontWeight = "bold";
    }
  }
  
  let currentPage = 1;
  const usersPerPage = 100;

  function renderPaginationControls(totalUsers) {
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination-controls";
    paginationContainer.style.display = "flex";
    paginationContainer.style.justifyContent = "center";
    paginationContainer.style.marginTop = "20px";

    const totalPages = Math.ceil(totalUsers / usersPerPage);
    
    // Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevButton);

    // Page info
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    pageInfo.style.margin = "0 10px";
    paginationContainer.appendChild(pageInfo);

    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextButton);

    const existingPagination = document.querySelector(".pagination-controls");
    if (existingPagination) {
      existingPagination.remove();
    }
    parentNode.appendChild(paginationContainer);
  }

  function changePage(pageNumber) {
    currentPage = pageNumber;
    const existingTable = document.getElementById("hacksStandingsTable");
    if (existingTable) {
      existingTable.remove();
    }
    getAndInsertTable(); // Re-fetch and re-render the table with the new page
  }

  function insertTable(hackerArray, probIndices, contestId, hacksWindow) {
    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedHackerArray = hackerArray.slice(
      startIndex,
      startIndex + usersPerPage
    );

    const table = document.createElement("table"); // Creating the table element
    table.id = "hacksStandingsTable";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    //Creating the headers of the table
    const headers = ["Rank", "User", "Hacks"];
    probIndices.forEach((index) => {
      index = index.toUpperCase();
      headers.push(index);
    });

    headers.forEach((headerText, index) => {
      const th = document.createElement("th");
      if (index >= 3) {
        th.innerHTML = `<a href="https://codeforces.com/contest/${contestId}/problem/${headerText}">${headerText}</a>`;
      } else {
        th.innerHTML = headerText;
      }
      th.style.border = "1px solid #ddd";
      th.style.padding = "8px";
      th.style.backgroundColor = "#f2f2f2";
      th.style.textAlign = "center";
      headerRow.appendChild(th);
    });

    //Creating the body of the table
    const tbody = table.createTBody();
    let totals = [];
    for (let i = 0; i < probIndices.length + 1; i++) {
      totals.push({ success: 0, fail: 0 });
    }

    paginatedHackerArray.forEach((hacker, index) => {
      totals[0].success += hacker.totalSuccess;
      totals[0].fail += hacker.totalFail;
      const rank = hacker.rank;
      const row = tbody.insertRow();
      const cells = [
        startIndex + index + 1,
        hacker.handle,
        [hacker.totalSuccess, hacker.totalFail],
      ];
      //Iterating over each problem and inserting the number of successful and unsuccessful hacks
      probIndices.forEach((probIndex, index) => {
        probIndex = probIndex.toUpperCase();
        cells.push([
          hacker[probIndex].successCount,
          hacker[probIndex].failCount,
        ]);
        totals[index + 1].success += hacker[probIndex].successCount;
        totals[index + 1].fail += hacker[probIndex].failCount;
      });

      cells.forEach((value, index) => {
        const cell = row.insertCell();
        if (index === 1) {
          let text = `${hacker.handle}`;
          let fontWeight = 700;

          if (rank === "Tourist" || rank === "Туристический") {
            //First letter of Tourist is red
            text = `<span style = "color:#ff0000;">${hacker.handle[0]}</span>${hacker.handle.slice(1)}`;
          } else if (rank === "Legendary Grandmaster" || rank === "Легендарный гроссмейстер") {
            text = `<span style = "color:#000000;">${hacker.handle[0]}</span>${hacker.handle.slice(1)}`;
          } else if (rank === "Unrated," || rank === "Не рейтинге,") {
            //Unrated users are shown in black color but with a lighter font-weight
            fontWeight = 400;
          }
          //Creating the template for the hacker's handle
          let template = `<a style ="font-family: Helvetica;font-weight:${fontWeight};text-decoration:none; color:${colors[rank]}" href="https://codeforces.com/profile/${hacker.handle}" target="_blank">${text}</a>`;
          //Inserting the hacker's handle into the cell
          cell.innerHTML = template;
        } else if (index >= 2) {
          //Inserting the number of successful and unsuccessful hacks into the cell
          if (value[0] === 0 && value[1] === 0) {
            cell.innerHTML = `-`;
          } else {
            cell.innerHTML = `<span style = "color: green" title = "Successful hacking attempts">+${value[0]}</span> : <span style = "color: red" title = "Unsuccessful hacking attempts">-${value[1]}</span>`;
            if (index >= 3) {
              cell.setAttribute("hack-details", `${hacker.handle} ${probIndices[index - 3]}`);
              cell.ondblclick = (event) => hacksWindow.openWindow(cell);
            }
          }
        } else {
          cell.textContent = value;
        }
        cell.style.border = "1px solid #ddd";
        cell.style.padding = "8px";
        cell.style.textAlign = "center";
      });

      if (index === paginatedHackerArray.length - 1) {
        insertLastRow(totals, tbody);
      }

      const currentUserHandle = document.querySelector('.lang-chooser > div:nth-of-type(2) > a:nth-of-type(1)').textContent.trim();
      if (hacker.handle === currentUserHandle) {
        row.style.backgroundColor = "#ddeeff";
      }
    });

    if (parentNode) {
      parentNode.appendChild(table);
    }

    renderPaginationControls(hackerArray.length); // Add pagination controls
  }

  createButton();
  //Reapplying the lavaLamp effect on the menu items
  setTimeout(() => {
    $(".second-level-menu-list").lavaLamp({
      fx: "backout",
      speed: 700,
    });
    let children = document.querySelector(".second-level-menu-list").children;
    if (children[0].className === children[1].className) {
      children[0].remove();
      console.log("Removed");
    }
  }, 100);
})();
