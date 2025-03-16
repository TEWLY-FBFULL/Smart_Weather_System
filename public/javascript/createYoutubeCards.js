async function createYoutubeVideosCard(youtubeVideos) {
    const container = document.getElementById("Youtube");

    youtubeVideos.forEach(video => {
        const card = document.createElement("div");
        card.classList.add("youtube-video-card");
    
        card.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.video_id}" target="_blank" data-aos="fade-up">
                <div class="youtube-video-thumbnail">
                    <iframe src="https://www.youtube-nocookie.com/embed/${video.videoId}" allowfullscreen></iframe>
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
