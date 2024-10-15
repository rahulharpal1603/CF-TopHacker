class HacksWindow {
  constructor(hackDetails, contestId) {
    this.hackDetails = hackDetails;
    this.contestId = contestId;

    const styles = `
            /* Overlay to cover the whole page */
            .overlay {
                display: none; /* Hidden by default */
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
                z-index: 1000;
            }

            /* Popup window styles */
            .popup {
                position: relative;
                width: 60%;
                height: 60%; /* 60% of the viewport height */
                margin: 100px auto;
                padding: 20px;
                background-color: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                overflow-y: auto; /* Enable vertical scrolling */
            }

            /* Close button styles */
            .close {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }

            .close:hover {
                color: #333; /* Darker color on hover */
            }

            /* content div styles */
            .content {
                min-height : 90%;
                border: 1px solid #ccc; /* Border color */
                padding: 10px; /* Padding inside the bordered div */
                margin-top: 20px; /* Space above the bordered div */
                border-radius: 5px; /* Optional: Rounded corners */
            }


            /* Link styles */
            .link {
                color: blue; /* Link color */
        
                text-decoration: underline; /* Underlined link */
                cursor: pointer; /* Pointer cursor for links */
            }

            .link:hover {
                color: darkblue; /* Darker color on hover */
            }
        `;

    // Create a style element
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    // Append the style element to the head of the document
    document.head.appendChild(styleSheet);

    // Create the overlay div
    this.overlay = document.createElement("div");
    this.overlay.id = "popup-overlay";
    this.overlay.classList.add("overlay");

    // Create the pwindow div
    this.window = document.createElement("div");
    this.window.id = "popup";
    this.window.classList.add("popup");

    this.overlay.appendChild(this.window);

    document.body.appendChild(this.overlay);

    // Close the popup when clicking outside the popup
    this.overlay.onclick = (event) => {
      // Use arrow function to keep `this` context
      if (event.target === this.overlay) {
        this.closeWindow(); // Use `this.closeWindow()`
      }
    };
  }

  // Function to show the popup
  openWindow(element) {
    this.clearWindow();

    const titleAttr = $(element).attr("hack-details"); // Check if title exists

    if (titleAttr) {
      const [handle, problem] = titleAttr.split(" ");

      if (this.hackDetails[handle] && this.hackDetails[handle][problem]) {
        this.hackDetails[handle][problem].forEach((item) => {
          let name = "verdict-accepted";
          if (
            item.verdict === "Unsuccessful hacking attempt" ||
            item.verdict === "Неудачная попытка взлома"
          )
            name = "verdict-rejected";

          const ele = document.createElement("p");
          ele.innerHTML = `${item.date} &nbsp 
                     <span class="${name}">   ${item.verdict} </span>
                      →
                      <a class="link" href="https://codeforces.com/contest/${this.contestId}/hacks/${item.id}" target="_blank">${item.id}</a>`;
          this.contentDiv.appendChild(ele); // Append to the bordered div
        });
      }
    }

    this.overlay.style.display = "block";
  }

  // Function to hide the window
  closeWindow() {
    this.overlay.style.display = "none";
  }

  // Clear the content of the window
  clearWindow() {
    this.window.innerHTML = "";
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.classList.add("close");
    closeButton.onclick = () => this.closeWindow(); // Close on click
    this.window.appendChild(closeButton); // Re-add close button

    // Create content div
    this.contentDiv = document.createElement("div");
    this.contentDiv.classList.add("content");
    this.window.appendChild(this.contentDiv);
  }
}
