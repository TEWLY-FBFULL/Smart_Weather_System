async function createYoutubeVideosCard(youtubeVideos) {
    const container = document.getElementById("Youtube");
    container.innerHTML = "";
    youtubeVideos.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("youtube-video-card");
        card.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.video_id}" target="_blank">
                <div class="youtube-video-thumbnail">
                    <img src="https://static.vecteezy.com/system/resources/previews/018/910/794/non_2x/youtube-logo-youtube-icon-youtube-symbol-free-free-vector.jpg" alt="thumbnail">
                </div>
                <div class="youtube-video-card-content">
                    <div class="youtube-video-title">${video.title}</div>
                    <div class="youtube-video-channel">${video.channel_title}</div>
                    <div class="youtube-video-description">${video.description}</div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

export { createYoutubeVideosCard };
