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
		const userRes = await fetch('/api/auth/me');
		if (!userRes.ok) {
			
			return;
		}
		const userData = await userRes.json();
		user = userData.user;

		loading = false;
		videos = [];
	});
</script>

<svelte:head>
	<title>{t.about} - LineTube</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="container">
			<h1>{t.watchLater}</h1>
			{#if loading}
				<div class="loading">{t.noWatchLater}</div>
			{:else if videos.length === 0}
				<div class="empty">{t.noWatchLater}</div>
			{:else}
				<VideoGrid {videos} />
			{/if}
			<br/>
			<a href="https://www.youtube.com/@wan_flue_kek"><button type="button" class="btn btn-primary"><h1>ab_lnd</h1></button></a>
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
		
		color: var(--text-secondary);
		font-size: 18px;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}
</style>
