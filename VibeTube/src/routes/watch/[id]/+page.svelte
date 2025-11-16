<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { 
		ThumbsUp, 
		ThumbsDown, 
		TrendingUp, 
		Edit2, 
		Play, 
		Pause, 
		Volume2, 
		VolumeX, 
		Maximize, 
		Minimize,
		Settings,
		SkipBack,
		SkipForward
	} from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Comments from '$lib/components/Comments.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { formatViews, formatTimeAgo } from '$lib/utils';
	import { language, translations } from '$lib/i18n';

	let video: any = null;
	let recommendations: any[] = [];
	let user: any = null;
	let sidebarOpen = false;
	let userLike: string | null = null;
	let isSubscribed = false;
	let loading = true;
	let currentLang: 'en' | 'ru' = 'en';

	let videoElement: HTMLVideoElement;
	let isPlaying = false;
	let currentTime = 0;
	let duration = 0;
	let volume = 1;
	let isMuted = false;
	let isFullscreen = false;
	let showControls = false;
	let controlsTimeout: any;
	let playbackRate = 1;
	let showSpeedMenu = false;
	let buffered = 0;

	language.subscribe(lang => {
		currentLang = lang;
	});

	$: t = translations[currentLang];
	$: videoId = $page.params.id;

	onMount(async () => {
		await loadVideo();
		
		if (typeof document !== 'undefined') {
			document.addEventListener('fullscreenchange', handleFullscreenChange);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		}
		clearTimeout(controlsTimeout);
	});

	function handleFullscreenChange() {
		if (typeof document !== 'undefined') {
			isFullscreen = !!document.fullscreenElement;
		}
	}

	async function loadVideo() {
		loading = true;

		try {
			if (typeof window !== 'undefined') {
				const userRes = await fetch('/api/auth/me');
				if (userRes.ok) {
					const userData = await userRes.json();
					user = userData.user;
				}
			}
		} catch (e) {}

		const res = await fetch(`/api/videos/${videoId}`);
		if (res.ok) {
			const data = await res.json();
			video = data.video;

			if (user && videoId && typeof window !== 'undefined') {
				await fetch('/api/watch-history', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ videoId })
				});
			}

			if (user) {
				const likeRes = await fetch(`/api/likes?videoId=${videoId}`);
				if (likeRes.ok) {
					const likeData = await likeRes.json();
					userLike = likeData.like;
				}

				const subRes = await fetch(`/api/subscriptions?channelId=${video.user_id}`);
				if (subRes.ok) {
					const subData = await subRes.json();
					isSubscribed = subData.subscribed;
				}
			}
		}

		const recsRes = await fetch('/api/videos?limit=10');
		if (recsRes.ok) {
			const recsData = await recsRes.json();
			if (videoId) {
				recommendations = recsData.videos.filter((v: any) => v.id !== parseInt(videoId));
			} else {
				recommendations = recsData.videos;
			}
		}

		loading = false;
	}

	function togglePlay() {
		if (videoElement?.paused) {
			videoElement.play();
			isPlaying = true;
		} else {
			videoElement?.pause();
			isPlaying = false;
		}
	}

	function handleTimeUpdate() {
		if (!videoElement) return;
		
		currentTime = videoElement.currentTime;
		duration = videoElement.duration;
		
		if (videoElement.buffered.length > 0) {
			buffered = (videoElement.buffered.end(0) / duration) * 100;
		}
	}

	function handleProgressClick(e: MouseEvent) {
		if (!videoElement) return;
		
		const progressBar = e.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const percent = (e.clientX - rect.left) / rect.width;
		videoElement.currentTime = percent * duration;
	}

	function handleVolumeChange(e: Event) {
		if (!videoElement) return;
		
		const target = e.target as HTMLInputElement;
		volume = parseFloat(target.value);
		videoElement.volume = volume;
		isMuted = volume === 0;
	}

	function toggleMute() {
		if (!videoElement) return;
		
		isMuted = !isMuted;
		videoElement.muted = isMuted;
		if (isMuted) {
			volume = 0;
		} else {
			volume = videoElement.volume || 1;
		}
	}

	function toggleFullscreen() {
		if (typeof document === 'undefined') return;
		
		const player = document.querySelector('.player') as HTMLElement;
		if (!player) return;
		
		if (!isFullscreen) {
			if (player.requestFullscreen) {
				player.requestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	}

	function changePlaybackRate(rate: number) {
		if (!videoElement) return;
		
		playbackRate = rate;
		videoElement.playbackRate = rate;
		showSpeedMenu = false;
	}

	function skip(seconds: number) {
		if (!videoElement) return;
		
		videoElement.currentTime += seconds;
	}

	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		
		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	}

	function showPlayerControls() {
		showControls = true;
		clearTimeout(controlsTimeout);
		controlsTimeout = setTimeout(() => {
			if (isPlaying) {
				showControls = false;
			}
		}, 3000);
	}

	function handleVideoClick() {
		togglePlay();
		showPlayerControls();
	}

	async function handleLike(type: 'like' | 'dislike') {
		if (!user) {
			if (typeof window !== 'undefined') {
				window.location.href = '/login';
			}
			return;
		}

		const res = await fetch('/api/likes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ videoId, type })
		});

		if (res.ok) {
			const data = await res.json();
			if (data.action === 'removed') {
				userLike = null;
			} else {
				userLike = type;
			}
			await loadVideo();
		}
	}

	async function handleSubscribe() {
		if (!user) {
			if (typeof window !== 'undefined') {
				window.location.href = '/login';
			}
			return;
		}

		const res = await fetch('/api/subscriptions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ channelId: video.user_id })
		});

		if (res.ok) {
			const data = await res.json();
			isSubscribed = data.subscribed;
			await loadVideo();
		}
	}
</script>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		{#if loading}
			<div class="loading">{t.loading}</div>
		{:else if video}
			<div class="watch-layout">
				<div class="primary">
					<div 
						class="player" 
						class:fullscreen={isFullscreen}
						on:mousemove={showPlayerControls}
						on:mouseleave={() => { if (isPlaying) showControls = false; }}
					>
						<video 
							bind:this={videoElement}
							autoplay
							on:click={handleVideoClick}
							on:timeupdate={handleTimeUpdate}
							on:loadedmetadata={handleTimeUpdate}
							on:play={() => isPlaying = true}
							on:pause={() => isPlaying = false}
							on:ended={() => isPlaying = false}
						>
							<source src={video.video_url} type="video/mp4" />
							<track kind="captions" />
						</video>

						<div class="player-controls" class:visible={showControls || !isPlaying}>
							<div class="controls-bottom">
								<div class="progress-container" on:click={handleProgressClick}>
									<div class="progress-bar">
										<div class="buffered-bar" style={`width: ${buffered}%`}></div>
										<div class="progress-fill" style={`width: ${(currentTime / duration) * 100}%`}></div>
									</div>
								</div>

								<div class="controls-main">
									<div class="controls-left">
										<button class="control-btn" on:click={togglePlay}>
											{#if isPlaying}
												<Pause size={20} />
											{:else}
												<Play size={20} />
											{/if}
										</button>

										<button class="control-btn" on:click={() => skip(-10)} title="Назад 10 сек">
											<SkipBack size={20} />
										</button>

										<button class="control-btn" on:click={() => skip(10)} title="Вперед 10 сек">
											<SkipForward size={20} />
										</button>

										<div class="volume-control">
											<button class="control-btn" on:click={toggleMute} title="Громкость">
												{#if isMuted || volume === 0}
													<VolumeX size={20} />
												{:else}
													<Volume2 size={20} />
												{/if}
											</button>
											<input
												type="range"
												class="volume-slider"
												min="0"
												max="1"
												step="0.1"
												bind:value={volume}
												on:input={handleVolumeChange}
											/>
										</div>

										<div class="time-display">
											<span>{formatTime(currentTime)} / {formatTime(duration)}</span>
										</div>
									</div>

									<div class="controls-right">
										<div class="speed-control">
											<button 
												class="control-btn" 
												on:click={() => showSpeedMenu = !showSpeedMenu}
												title="Скорость воспроизведения"
											>
												{playbackRate}x
											</button>
											{#if showSpeedMenu}
												<div class="speed-menu">
													{#each [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as speed}
														<button 
															class:active={playbackRate === speed}
															on:click={() => changePlaybackRate(speed)}
														>
															{speed}x
														</button>
													{/each}
												</div>
											{/if}
											
										</div>

										<button class="control-btn" on:click={toggleFullscreen} title="Полный экран">
											{#if isFullscreen}
												<Minimize size={20} />
											{:else}
												<Maximize size={20} />
											{/if}
										</button>
									</div>
								</div>
							</div>
						</div>

						{#if loading && !videoElement?.readyState}
							<div class="loading-overlay">
								<div class="spinner"></div>
								<span>Загрузка видео...</span>
							</div>
						{/if}
					</div>

					<div class="video-info">
						<h1>{video.title}</h1>
						<div class="video-meta">
							<div class="channel-info">
								<a href="/channel/{video.user_id}" class="channel">
									<img src={video.user_avatar} alt={video.username} />
									<div>
										<p>{formatViews(video.subscribers)} {t.subscribers}</p>
										<h3>{video.username}</h3>
									</div>
								</a>
								{#if user && video.user_id === user.id}
									<div class="author-actions">
										<a href="/studio/analytics" class="btn-secondary">
											<TrendingUp size={18} />
											{t.analytics}
										</a>
										<a href="/studio/edit/{video.id}" class="btn-primary">
											<Edit2 size={18} />
											{t.editVideo}
										</a>
									</div>
								{:else if user}
									<button class="btn-primary" class:subscribed={isSubscribed} on:click={handleSubscribe}>
										{isSubscribed ? t.subscribed : t.subscribe}
									</button>
								{/if}
							</div>
							<div class="actions">
								<button class="action-btn" class:active={userLike === 'like'} on:click={() => handleLike('like')}>
									<ThumbsUp size={30} />
									{video.likes}
								</button>
								<button class="action-btn" class:active={userLike === 'dislike'} on:click={() => handleLike('dislike')}>
									<ThumbsDown size={30} />
									{video.dislikes}
								</button>
							</div>
						</div>
					</div>

					<div class="description">
						<div class="stats">
							{formatViews(video.views)} {t.views} • {formatTimeAgo(video.created_at, currentLang)}
						</div>
						<p>{video.description || (currentLang === 'ru' ? 'Нет описания' : 'No description')}</p>
					</div>

					<Comments videoId={video.id} {user} videoAuthorId={video.user_id} />
				</div>

				<div class="secondary">
					<VideoGrid videos={recommendations} compact />
				</div>
			</div>
		{:else}
			<div class="error">{currentLang === 'ru' ? 'Видео не найдено' : 'Video not found'}</div>
		{/if}
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		margin-top: 56px;
		margin-left: 0;
		transition: margin-left 0.3s;
	}

	main.sidebar-open {
		margin-left: 240px;
	}

	.watch-layout {
		display: flex;
		gap: 24px;
		padding: 24px;
		max-width: 1920px;
		margin: 0 auto;
	}

	.primary {
		flex: 1;
		min-width: 0;
	}

	.secondary {
		width: 400px;
		flex-shrink: 0;
	}

	.player {
		position: relative;
		background: #1f0303ff;
		border-radius: 5px;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.player:hover {
		background: #0f0202ff;
		backdrop-filter: blur(3px);
		
	}

	.player.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		border-radius: 0;
		
	}

	.player video {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.player-controls {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		padding: 20px;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		backdrop-filter: blur(4px);
	}
	.player-controls:hover {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(7, 1, 1, 0.7));
		padding: 20px;
		opacity: 1;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.player-controls.visible {
		opacity: 1;
		pointer-events: revert;
	}

	.controls-bottom {
		width: 100%;
		
	}

	.progress-container {
		width: 100%;
		height: 4px;
		margin-bottom: 15px;
		cursor: pointer;
		background: rgba(173, 30, 30, 0.2);
		border-radius: 2px;
		position: relative;
	}

	.progress-bar {
		position: relative;
		width: 100%;
		height: 100%;
		
	}

	.buffered-bar {
		position: absolute;
		height: 100%;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		transition: width 0.2s ease;
	}

	.progress-fill {
		position: absolute;
		height: 100%;
		background: linear-gradient(135deg, #670fcc94, #cc195e94);
		border-radius: 2px;
		transition: 0.4s ease;
	}
	.progress-fill:hover {
		position: absolute;
		height: 100%;
		background: linear-gradient(135deg, #7e0dff94, #e91e6c94);
		border-radius: 2px;
		transition: 0.4s ease;
	}

	.controls-main {
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		background: #ff004c18;
	}
	.controls-main:hover {
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 15px;
		background: #b4083c18;
	}

	.controls-left,
	.controls-right {
		display: flex;
		align-items: center;
		gap: 20px;
		background: #d81d4b4f;
		border-radius: 4px
		transition: 0.4s ease;
	}
	.controls-left:hover,
	.controls-right:hover {
		display: flex;
		align-items: center;
		gap: 20px;
		background: #8b13314f;
		border-radius: 4px
		transition: 0.4s ease;
	}

	.control-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 5px;
		border-radius: 4px;
		transition: background 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.control-btn:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.volume-control {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.volume-slider {
		width: 0;
		opacity: 0;
		transition: all 0.3s ease;
	}

	.volume-control:hover .volume-slider {
		width: 89px;
		opacity: 1;
		
	}

	.time-display {
		color: white;
		font-size: 14px;
		font-weight: 500;
	}

	.speed-control {
		position: relative;
	}

	.speed-menu {
		position: absolute;
		bottom: 100%;
		right: 0;
		background: rgba(0, 0, 0, 0.9);
		border-radius: 4px;
		padding: 5px 0;
		min-width: 80px;
	}

	.speed-menu button {
		width: 100%;
		background: none;
		border: none;
		color: white;
		padding: 8px 12px;
		cursor: pointer;
		text-align: left;
	}

	.speed-menu button:hover,
	.speed-menu button.active {
		background: rgba(255, 255, 255, 0.1);
	}

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
		gap: 10px;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(255, 255, 255, 0.3);
		border-left: 4px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.video-info {
		margin-top: 16px;
	}

	h1 {
		font-size: 20px;
		font-weight: 500;
		margin-bottom: 12px;
	}

	.video-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.channel-info {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.channel {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: var(--text-primary);
	}

	.channel img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.channel h3 {
		font-size: 15px;
		font-weight: 500;
	}

	.channel p {
		font-size: 12px;
		color: var(--text-secondary);
	}

	.subscribed {
		background: var(--bg-secondary) !important;
	}

	.author-actions {
		display: flex;
		gap: 12px;
	}

	.author-actions a {
		display: flex;
		align-items: center;
		gap: 8px;
		text-decoration: none;
	}

	.actions {
		display: flex;
		gap: 10px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 99px;
		padding: 10px 10px;
		background: var(--bg-secondary);
		border-radius: 20px;
		font-weight: 500;
		transition: background 0.2s;
	}

	.action-btn:hover {
		background: var(--bg-hover);
	}

	.action-btn.active {
		color: var(--accent);
	}

	.description {
		background: var(--bg-secondary);
		padding: 16px;
		border-radius: 12px;
		margin-top: 16px;
	}

	.stats {
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 8px;
	}

	.description p {
		font-size: 14px;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--text-secondary);
		font-size: 18px;
	}

	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--text-secondary);
		font-size: 18px;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}

		.watch-layout {
			flex-direction: column;
		}

		.secondary {
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.watch-layout {
			padding: 16px 12px;
			gap: 16px;
		}

		.player {
			border-radius: 8px;
		}

		h1 {
			font-size: 18px;
		}

		.video-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.channel-info {
			width: 100%;
			flex-direction: column;
			align-items: flex-start;
		}

		.actions {
			width: 100%;
			flex-wrap: wrap;
		}

		.action-btn {
			flex: 1;
			justify-content: center;
			padding: 10px 12px;
			font-size: 14px;
			
		}

		.description {
			padding: 12px;
		}

		.controls-main {
			flex-wrap: wrap;
			gap: 0px;
			
		}

		
	}

	@media (max-width: 480px) {
		.watch-layout {
			padding: 8px 0;
			gap: 12px;
		}

		.player {
			border-radius: 0;
		}

		h1 {
			font-size: 16px;
			padding: 0 12px;
		}

		.video-info {
			padding: 0 12px;
		}

		.video-meta {
			gap: 8px;
		}

		.channel img {
			width: 36px;
			height: 36px;
		}

		.channel h3 {
			font-size: 14px;
		}

		.action-btn {
			padding: 8px 10px;
			font-size: 13px;
			justify-content: space-between;
			gap: 6px;
		}

		.description {
			margin: 0 12px;
			padding: 10px;
		}

		.stats {
			font-size: 13px;
		}

		.loading,
		.error {
			min-height: 250px;
			font-size: 14px;
		}

		.volume-slider {
			width: 60px !important;
			opacity: 1 !important;
		}

		
	}
</style>