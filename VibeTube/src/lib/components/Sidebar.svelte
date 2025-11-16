<script lang="ts">
	import { Home, TrendingUp, History, Clock, ThumbsUp, PlaySquare, CircleAlert } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { language, translations } from '$lib/i18n';

	export let isOpen = true;
	export let user: any = null;

	let currentLang: 'en' | 'ru' = 'en';

	language.subscribe(lang => {
		currentLang = lang;
	});

	$: t = translations[currentLang];
	$: currentPath = $page.url.pathname;
</script>

<aside class:closed={!isOpen}>
	<nav>
		<a href="/" class:active={currentPath === '/'}>
			<Home size={20} />
			<span>{t.home}</span>
		</a>
		<a href="/trending">
			<TrendingUp size={20} />
			<span>{t.trending}</span>
		</a>
		<a href="/watch-later">
				<Home size={20} />
				<span>{t.watchLater}</span>
			</a>
			<a href="/game">
				<CircleAlert size={20} />
				<span>{t.eaglercraft}</span>
			</a>
		{#if user}
			<hr />
			<a href="/history">
				<History size={20} />
				<span>{t.history}</span>
			</a>
			
			<a href="/liked">
				<ThumbsUp size={20}/>
				<span>{t.liked}</span>
			</a>
			<a href="/my-videos">
				<PlaySquare size={20} />
				<span>{t.myVideos}</span>
			</a>
			
		{/if}
			
	</nav>
</aside>

<style>
	aside {
		position: fixed;
		left: 0;
		top: 80px;
		bottom: 0;
		width: 220px;
		height: 360px;
		background: #03161ba4;
		border-right: 0px solid var(--border);
		border-top: 2px solid var(--border);
		border-bottom: 2px solid var(--border);
		padding: 20px 0;
		overflow-y: auto;
		transition: 0.4s;
		z-index: 900;
		backdrop-filter: blur(3px);
	}

	aside.closed {
		transform: translateY(-800px);
		transition: 0.4s;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0px;
	}

	nav a {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 10px 24px;
		color: var(--text-primary);
		text-decoration: none;
		transition: background 0.2s;
	}

	nav a:hover {
		background: var(--accent);
	}

	nav a.active {
		background: var(--bg-secondary);
		font-weight: 500;
	}

	hr {
		border: none;
		border-top: 3px solid var(--border);
		margin: 9px 0;
	}

	
</style>
