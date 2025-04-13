document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.getElementById("searchInput");
    let resultsContainer = document.getElementById("searchResults");
    let watchingList = document.querySelector(".watching-list");
    let videoContainers = [];

    // 🔹 Collect All Video Containers
    document.querySelectorAll(".video-container").forEach(container => {
        let titleElement = container.querySelector("h4, h5, .card-title");
        let iframe = container.querySelector("iframe");
        let thumbnail = container.querySelector("img");
        let playButton = container.querySelector(".play-button");
        let overlayContent = container.querySelector(".overlay-content");
        let overlay = container.querySelector(".overlay")
        let badgeTrending = container.querySelector(".badge-trending");

        if (titleElement && iframe && thumbnail && playButton) {
            let animeData = {
                title: titleElement.innerText.trim().toLowerCase(),
                container: container,
                overlay: overlay,
                iframe: iframe,
                thumbnail: thumbnail,
                playButton: playButton,
                overlayContent: overlayContent,
                badgeTrending: badgeTrending,
                originalSrc: iframe.src,
                imageSrc: thumbnail.src
            };

            videoContainers.push(animeData);
            playButton.addEventListener("click", () => playAnime(animeData));
        }
    });

    // 🔹 Fix Search Bar (Now Works Again)
    searchInput.addEventListener("input", function () {
        let query = this.value.trim().toLowerCase();
        resultsContainer.innerHTML = "";

        if (query.length > 2) {
            let filteredResults = videoContainers.filter(anime => anime.title.includes(query));

            if (filteredResults.length === 0) {
                resultsContainer.classList.remove("show");
            } else {
                resultsContainer.classList.add("show");
                filteredResults.forEach(anime => {
                    let resultItem = document.createElement("div");
                    resultItem.classList.add("search-result-item");
                    resultItem.innerHTML = `<p>${anime.title}</p>`;


                    resultItem.addEventListener("click", function () {
                        playAnime(anime);
                        resultsContainer.classList.remove("show");
                        searchInput.value = ""; // 🔹 Clear search after selecting
                    });

                    resultsContainer.appendChild(resultItem);
                });
            }
        } else {
            resultsContainer.classList.remove("show");
        }
    });

    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
            resultsContainer.classList.remove("show");
        }
    });

    // 🔹 Play Anime & Hide Elements
    function playAnime(anime) {
        console.log("🎬 Playing:", anime.title);

        anime.thumbnail.style.display = "none";
        anime.playButton.style.display = "none";
        anime.overlay.style.display = "none";

        anime.iframe.src = anime.originalSrc + "?autoplay=1";
        anime.iframe.style.display = "block";

        // Hide title, badge & overlay-content for "Classroom of the Elite"
        if (anime.title.includes("classroom of the elite")) {
            if (anime.overlayContent) anime.overlayContent.style.display = "none";
            if (anime.badgeTrending) anime.badgeTrending.style.display = "none";
        }

        let closeButton = anime.container.querySelector(".close-iframe");
        if (!closeButton) {
            closeButton = document.createElement("button");
            closeButton.innerText = "✖";
            closeButton.classList.add("close-iframe");
            anime.container.appendChild(closeButton);
            closeButton.addEventListener("click", function () {
                closeAnime(anime, closeButton);
            });
        }
        closeButton.style.display = "block";

        addToContinueWatching(anime);
    }

    // 🔹 Close Anime & Show Elements
    function closeAnime(anime, closeButton) {
        anime.iframe.src = "";
        setTimeout(() => {
            anime.iframe.src = anime.originalSrc;
        }, 100);

        anime.playButton.style.display = "block";
        anime.overlay.style.display = "block";

        anime.iframe.style.display = "none";
        closeButton.style.display = "none";
        anime.thumbnail.style.display = "block";
        anime.playButton.style.display = "block";

        // Show title, badge & overlay-content for "Classroom of the Elite"
        if (anime.title.includes("classroom of the elite")) {
            if (anime.overlayContent) anime.overlayContent.style.display = "block";
            if (anime.badgeTrending) anime.badgeTrending.style.display = "block";
        }
    }

    function addToContinueWatching(anime) {
        let existingItem = [...watchingList.children].find(item =>
            item.querySelector("h5").innerText === anime.title
        );

        if (existingItem) {
            watchingList.prepend(existingItem);
        } else {
            let newItem = document.createElement("div");
            newItem.classList.add("watching-item", "mb-1");
            newItem.innerHTML = `
                <img src="${anime.imageSrc}" class="img-fluid rounded" alt="${anime.title}">
                <div class="watching-info">
                    <h5>${anime.title}</h5>
                    <a href="#" class="play-buttons"><i class="bi bi-play-fill"></i></a>
                </div>
            `;

            newItem.querySelector(".play-buttons").addEventListener("click", function () {
                playAnime(anime);
            });

            watchingList.prepend(newItem);

            if (watchingList.children.length > 3) {
                watchingList.removeChild(watchingList.lastElementChild);
            }
        }
    }
    // 🔹 Custom Card Component (For "Continue Watching")
    function createCustomCard(anime) {
        let newItem = document.createElement("div");
        newItem.classList.add("custom-card", "watching-item", "mb-1");
        newItem.innerHTML = `
            <img src="${anime.imageSrc}" class="img-fluid rounded" alt="${anime.title}">
            <div class="watching-info">
                <h5>${anime.title}</h5>
                <a href="#" class="play-buttons"><i class="bi bi-play-fill"></i></a>
            </div>
        `;

        newItem.querySelector(".play-buttons").addEventListener("click", function (event) {
            event.preventDefault();
            let matchedAnime = videoContainers.find(a => a.title === anime.title);
            if (matchedAnime) {
                playAnime(matchedAnime);
            } else {
                console.log("❌ No matching anime found for", anime.title);
            }
        });

        return newItem;
    }

    // 🔹 Fix "Continue Watching" Play Button (Opens Iframe)
    document.addEventListener("click", function (event) {
        let button = event.target.closest(".watching-item .play-buttons");
        if (button) {
            event.preventDefault();
            let cardTitle = button.closest(".watching-item").querySelector("h5").innerText.trim().toLowerCase();
            let matchedAnime = videoContainers.find(a => a.title.toLowerCase() === cardTitle);

            if (matchedAnime) {
                playAnime(matchedAnime);
            } else {
                console.log("❌ No matching anime found for", cardTitle);
            }
        }
    });
});

// Profile images ke URLs. Yahan placeholder images ka use kiya gaya hai.
const profiles = {
    raman: {    
      image: "images/p1.jpg"
    },
    wajahat: { 
      image: "images/p2.jpg"
    },
    moiz: {
       image: "images/p3.jpg"
    }
  };

const profileDropdown = document.getElementById('profileDropdown');
const profileDisplay = document.getElementById('profileDisplay');

profileDropdown.addEventListener('change', function () {
    const selectedProfile = this.value;
    if (!selectedProfile) {
        profileDisplay.innerHTML = `
        <img src="https://via.placeholder.com/120?text=User" alt="Default Profile">
       
      `;
        return;
    }

    const profile = profiles[selectedProfile];

    profileDisplay.innerHTML = `
      <img src="${profile.image}" alt="${profile.name} Profile Picture">

    `;

});

