window.onload = () => {
    initialize();
    initObserver();
    document.addEventListener("mouseup", (e) => {
        const downloadMenu =
            document.getElementsByClassName("ytp-download-menu");
        const downloadBtn = document.getElementsByClassName(
            "ytp-download-button"
        );
        if (
            downloadMenu.length > 0 &&
            downloadBtn.length > 0 &&
            !downloadBtn[0].contains(e.target) &&
            downloadMenu[0].style.display === "block"
        ) {
            downloadMenu[0].style.display = "none";
        }
    });
};

function initObserver() {
    let lastUrl = location.href;
    let lastTitle = document.title;
    new MutationObserver(() => {
        const url = location.href;
        const title = document.title;
        if (
            url !== lastUrl &&
            url.indexOf("https://www.youtube.com/watch") != -1 &&
            title !== lastTitle
        ) {
            lastUrl = url;
            lastTitle = title;
            initialize();
        }
    }).observe(document.getElementsByTagName("title")[0], {
        subtree: true,
        childList: true,
    });
}

function initialize() {
    const youtubeRightBtn =
        document.getElementsByClassName("ytp-right-controls");

    if (youtubeRightBtn.length > 0) {
        console.log(youtubeRightBtn);
        createDownloadBtn(youtubeRightBtn);
        removeElementsByClass("ytp-download-menu");
        initDownloadPopup();
    }
}

function createDownloadBtn(controlsBtn) {
    const checkDownlaodBtn = document.getElementsByClassName(
        "ytp-download-button"
    )[0];
    if (checkDownlaodBtn) {
        return;
    }

    let ytpDownlaodBtn = document.createElement("button");
    ytpDownlaodBtn.classList.add("ytp-button", "ytp-download-button");
    ytpDownlaodBtn.title = "Download Video";

    ytpDownlaodBtn.onclick = function () {
        const downloadMenu =
            document.getElementsByClassName("ytp-download-menu");
        if (downloadMenu.length > 0) {
            downloadMenu[0].style.display =
                downloadMenu[0].style.display === "block" ? "none" : "block";
        }
    };
    ytpDownlaodBtn.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use class="ytp-svg-shadow"></use>
    <path d="M16.3718 10H19.6323C20.1743 10 20.6104 10.4459 20.6104 11.0002V18.0016H24.1847C24.9101 18.0016 25.2729 18.8976 24.7593 19.4227L18.5604 25.7656C18.2547 26.0781 17.7534 26.0781 17.4478 25.7656L11.2407 19.4227C10.7271 18.8976 11.0899 18.0016 11.8153 18.0016H15.3937V11.0002C15.3937 10.4459 15.8298 10 16.3718 10Z" fill="white"/>
    </svg>
        `;
    [...controlsBtn].forEach((element) => {
        element.appendChild(ytpDownlaodBtn);
    });
}

function initDownloadPopup() {
    const moviePlayer = document.getElementById("movie_player");
    const downloadPopup = document.createElement("div");
    downloadPopup.classList.add(
        "ytp-popup",
        "ytp-settings-menu",
        "ytp-download-menu"
    );
    downloadPopup.style.width = "150px";
    downloadPopup.style.height = "180px";
    downloadPopup.setAttribute("data-layer", 6);
    downloadPopup.style.display = "none";

    downloadPopup.innerHTML = `

    <div
        class="ytp-panel ytp-quality-menu"
        style="width: 150px; height: 180px; min-width:150px"
    >
        <div class="ytp-panel-menu" role="menu" style="height: 180px; padding:0">

            <a href="http://localhost:32425/download/${
                location.href.split("=")[1]
            }/1080p/${
        document.title
    }" class="ytp-menuitem" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label">
                    <div>
                        <span>
                            1080p
                        </span>
                    </div>
                </div>
            </a>

            <a href="http://localhost:32425/download/${
                location.href.split("=")[1]
            }/720p/${
        document.title
    }" class="ytp-menuitem" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label">
                    <div>
                        <span>
                            720p
                        </span>
                    </div>
                </div>
            </a>

            <a href="http://localhost:32425/download/${
                location.href.split("=")[1]
            }/480p/${
        document.title
    }" class="ytp-menuitem" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label">
                    <div>
                        <span>
                            480p
                        </span>
                    </div>
                </div>
            </a>

            <a href="http://localhost:32425/download/${
                location.href.split("=")[1]
            }/360p/${
        document.title
    }" class="ytp-menuitem" tabindex="0" role="menuitemradio">
                <div class="ytp-menuitem-label">
                    <div>
                        <span>
                            360p
                        </span>
                    </div>
                </div>
            </a>

        </div>
    </div>
    `;

    moviePlayer.appendChild(downloadPopup);
}

function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    console.log(elements);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
