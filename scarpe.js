async function scrapeCodeforceHacks(url) {
    try {
      // Fetch the page content
      const response = await fetch(url);
      const html = await response.text();
  
      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
  
      // Find the table containing the hacks
      const hackTable = doc.querySelector('table.status-frame-datatable');
  
      if (hackTable) {
        // Extract data from each row
        const hacks = Array.from(hackTable.querySelectorAll('tr')).slice(1).map(row => {
          const columns = row.querySelectorAll('td');
          if (columns.length >= 6) {
            return {
              when: columns[1].textContent.trim(),
              hacker: columns[2].textContent.trim(),
              defender: columns[3].textContent.trim(),
              problem: columns[4].textContent.trim(),
              verdict: columns[5].textContent.trim()
            };
          }
          return null;
        }).filter(hack => hack !== null);
  
        return hacks;
      } else {
        console.error("Hack table not found on the page.");
        return null;
      }
    } catch (error) {
      console.error("Error scraping the page:", error);
      return null;
    }
  }
  
  // URL of the Codeforces contest hacks page
  const url = "https://codeforces.com/contest/1985/hacks?showAll=true";
  
  // Scrape the hacks
  scrapeCodeforceHacks(url).then(hacks => {
    if (hacks) {
      console.log("Scraped hacks:", hacks);
      // You can process the hacks data here
    }
  });