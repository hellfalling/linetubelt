<script lang="ts">
	import { formatViews, formatTimeAgo, formatDuration } from '$lib/utils';
	import { language, translations } from '$lib/i18n';

	export let video: any;
	export let compact = false;

	$: lang = $language;
	$: t = translations[lang];

	// Запрещенные ключевые слова
	const bannedKeywords = [
		'порно', 'porno', 'porn', 'onlyfans', 'only fans', 'only-fans',
		'порнография', 'pornography', 'xxx', 'xXXx', 'секс', 'sex',
		'взрослый контент', 'adult content', '18+', 'nsfw',
		'обнаженный', 'nude', 'naked', 'голый', 'голая','гoлый оnlyfаns взрoслый контeнт'
	];

	// Функция для проверки на запрещенный контент
	function containsBannedContent(text: string): boolean {
		if (!text) return false;
		
		const lowerText = text.toLowerCase();
		return bannedKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
	}

	// Проверяем, содержит ли видео запрещенный контент в названии или имени автора
	$: isBanned = containsBannedContent(video.title) || containsBannedContent(video.username);
</script>

{#if !isBanned}
	<a href="/watch/{video.id}" class="video-card" class:compact>
		<div class="thumbnail">
			{#if video.thumbnail_url}
				<img src={video.thumbnail_url} alt={video.title} />
			{:else}
				<div class="placeholder">
					<span class="no_thumbnail">{video.title}</span>
				</div>
			{/if}
			{#if video.duration}
				<span class="duration">{formatDuration(video.duration)}</span>
			{/if}
		</div>
		<div class="info">
			<img src={video.user_avatar} alt={video.username} class="avatar" />
			<div class="details">
				<h3>{video.title}</h3>
				<p class="channel">{video.username}</p>
				<p class="meta">
					{formatTimeAgo(video.created_at, lang)} • {formatViews(video.views)} {t.views} 
				</p>
			</div>
		</div>
	</a>
{/if}

<style>
	.video-card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		cursor: pointer;
		text-decoration: none;
		color: var(--text-primary);
		background: linear-gradient(135deg, #6720b894, #cc195e94);
		border-radius:12px;
	}

	.video-card.compact {
		flex-direction: row;
		gap: 8px;
	}

	.thumbnail {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 8.5;
		background: rgba(48, 16, 16, 1);
		border-radius: 6px;
		overflow: hidden;
		transition: 0.3s ease-in-out;
	}
	.thumbnail:hover {
		position: relative;
		width: 101%;
		aspect-ratio: 16 / 10;
		background: rgba(51, 23, 95, 1);
		border-radius: 6px;
		overflow: hidden;
		text-color:rgba(255, 255, 255, 1);
		transition: 0.3s ease-in-out;
		
	}
	
	.no_thumbnail {
		font-size:32px;
		
		
	}

	.compact .thumbnail {
		width: 210px;
		flex-shrink: 0;
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
	}

	.duration {
		position: absolute;
		bottom: 8px;
		right: 8px;
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 3px 6px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 500;
		backdrop-filter: blur(4px);
	}

	.info {
		display: flex;
		gap: 12px;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.compact .avatar {
		display: none;
	}

	.details {
		flex: 1;
		min-width: 0;
	}

	h3 {
		font-size: 14px;
		font-weight: 500;
		line-height: 1.4;
		margin-bottom: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		
		
	}

	.channel {
		font-size: 12px;
		color: var(--text-secondary);
		margin-bottom: 2px;
		
	}

	.meta {
		font-size: 12px;
		color: var(--text-secondary);
	}


	@media (max-width: 768px) {
		.video-card {
			gap: 10px;
		}

		.thumbnail {
			border-radius: 1px;
		}

		.avatar {
			width: 32px;
			height: 32px;
		}

		h3 {
			font-size: 13px;
			-webkit-line-clamp: 2;
		}

		.channel,
		.meta {
			font-size: 11px;
		}
	}

	@media (max-width: 480px) {
		.video-card {
			gap: 8px;
		}

		.info {
			gap: 10px;
		}

		.duration {
			bottom: 6px;
			right: 6px;
			padding: 2px 5px;
			font-size: 11px;
		}
	}

	
	@media (hover: none) {
		.video-card {
			-webkit-tap-highlight-color: rgba(155, 89, 182, 0.1);
			
		}
	}
</style>