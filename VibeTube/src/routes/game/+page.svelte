<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoGrid from '$lib/components/VideoGrid.svelte';
	import { language, translations } from '$lib/i18n';

	let videos: any[] = [];
	let user: any = null;
	let sidebarOpen = false;
	let loading = true;

	$: lang = $language;
	$: t = translations[lang];

	onMount(async () => {
		try {
			const userRes = await fetch('/api/auth/me');
			if (userRes.ok) {
				const userData = await userRes.json();
				user = userData.user;
			}
		} catch (e) {}

		const res = await fetch('/api/videos?limit=0');
		if (res.ok) {
			const data = await res.json();
			videos = data.videos.sort((a: any, b: any) => b.views - a.views);
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>{t.eaglercraft} - LineTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
	<iframe
  id="inlineFrameExample"
  title=""
  width="1560"
  height="560"
  src="https://minecraftforfree.org/play/?v=1.12.2">
</iframe>
		<div class="name">
			<h1>{t.minecraft}</h1>
			{#if loading}
				<div class="loading">{t.loading}</div>
			{:else if videos.length === 0}
				
			{:else}
				<VideoGrid {videos} />
			{/if}
		</div>
	</main>
	
</div>


<style>
	.app {
		min-height: 100vh;
	}

	main {
		margin-top: 56px;
		margin-left: 0;
		min-height: calc(100vh - 56px);
		transition: margin-left 0.3s;
	}


	h1 {
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 24px;
		padding-top: 24px;
	}

	.loading,
	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		color: var(--text-secondary);
		font-size: 18px;
	}
	iframe {
		padding: 16px;
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
		border-radius: 8px;
		border: 1px solid var(--border);
	}
	.name{
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
		border-radius: 2px;
		border: 1px solid var(--border);
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}
</style>
