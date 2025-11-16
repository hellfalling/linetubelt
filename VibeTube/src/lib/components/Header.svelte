<script lang="ts">
	import { Menu, Search, Video, User, LogOut, Settings, Sun, Moon } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { language, translations } from '$lib/i18n';
	import { theme } from '$lib/theme';
	import LanguageSwitcher from './LanguageSwitcher.svelte';

	export let user: any = null;
	export let onMenuClick: () => void = () => {};

	let searchQuery = '';
	let dropdownOpen = false;
	let closeTimeout: any = null;
	let currentLang: 'en' | 'ru' = 'en';
	let currentTheme: 'light' | 'dark' = 'dark';

	language.subscribe(lang => {
		currentLang = lang;
	});

	theme.subscribe(t => {
		currentTheme = t;
	});

	$: t = translations[currentLang];

	function toggleTheme() {
		theme.toggle();
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			goto(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	}

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/';
	}

	function openDropdown() {
		if (closeTimeout) {
			clearTimeout(closeTimeout);
			closeTimeout = null;
		}
		dropdownOpen = true;
	}

	function closeDropdown() {
		closeTimeout = setTimeout(() => {
			dropdownOpen = false;
		}, 300);
	}
</script>

<header>
	<div class="header-left">
		<button class="icon-btn" on:click={onMenuClick}>
			<Menu size={24} />
		</button>
		<a href="/" class="logo">
			<img src="/uploads/logo.png" alt="VibeTube" class="logo-image" />
			<span>LineTube</span>
		</a>
	</div>

	<form class="search-form" on:submit={handleSearch}>
		<input type="text" placeholder={t.search} bind:value={searchQuery} />
		<button type="submit" class="search-btn">
			<Search size={20} />
		</button>
	</form>

	<div class="header-right">
		
		<LanguageSwitcher />
		{#if user}
			<a href="/upload" class="upload-btn">
				<Video size={20} />
				<span>{t.upload}</span>
			</a>
			<div class="user-menu" on:mouseenter={openDropdown} on:mouseleave={closeDropdown}>
				<button class="icon-btn" aria-label="User menu">
					<img src={user.avatar} alt={user.username} class="avatar" />
				</button>
				<div class="dropdown" class:open={dropdownOpen} on:mouseenter={openDropdown} on:mouseleave={closeDropdown} role="menu" tabindex="-1">
					<a href="/channel/{user.id}">
						<User size={18} />
						{t.myChannel}
					</a>
					<a href="/settings">
						<Settings size={18} />
						{t.settings}
					</a>
					<a href="/studio">
						<User size={18} />
						{t.studio}
					</a>
					<button on:click={handleLogout}>
						<LogOut size={18} />
						{t.logout}
					</button>
				</div>
			</div>
		{:else}
			<a href="/login" class="btn-primary">{t.login}</a>
		{/if}
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 66px;
		background: var(--bg-primary);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 26px;
		z-index: 1000;
		border-bottom: 2px solid var(--border);
		border-top: 2px solid var(--border);
		
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 20px;
		font-weight: 700;
		color: var(--text-primary);
		text-decoration: none;
	}

	.logo-image {
		width: 56px;
		height: 56px;
		object-fit: contain;
		border-radius: 8px;
	}

	.icon-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}

	.icon-btn:hover {
		background: var(--bg-hover);
	}

	.theme-toggle {
		color: var(--text-primary);
	}

	.search-form {
		flex: 1;
		max-width: 600px;
		display: flex;
		margin: 0 40px;
	}

	.search-form input {

		height: 40px;
		padding: 0 16px;
		border-radius: 2px 0 0 20px;
		
	}

	.search-btn {
		width: 64px;
		height: 40px;
		background: #1b0303ff;
		border: 1px solid var(--border);
		border-left: none;
		border-radius: 0 20px 20px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.2s;
	}

	.search-btn:hover {
		background: var(--bg-hover);
		
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.upload-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border-radius: 20px;
		background: #ee080846;
		border: 1.5px solid var(--border);
		color: var(--text-primary);
		text-decoration: none;
		transition: background 0.2s;
		backdrop-filter: blur(4px);
	}

	.upload-btn:hover {
		background: #ee080828;
	}

	
	

	@media (max-width: 480px) {
		.search-form {
			position: absolute;
			top: 56px;
			left: 0;
			right: 0;
			margin: 0;
			padding: 8px;
			background: var(--bg-primary);
			border-bottom: 1px solid var(--border);
			display: none;
		}

		.search-form.active {
			display: flex;
		}

		.header-right {
			gap: 4px;
		}
	}

	.user-menu {
		position: relative;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
	}

	.dropdown {
		position: absolute;
		top: 48px;
		right: 0;
		background: #03161bc0;
		border: 1px solid var(--border);
		border-radius: 12px;
		min-width: 200px;
		padding: 8px;
		opacity: 0;
		visibility: hidden;
		flex-direction: column;
		gap: 4px;
		z-index: 1001;
		transition: opacity 0.2s, visibility 0.2s;
		pointer-events: none;
	}

	.dropdown.open {
		backdrop-filter: blur(4px);
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	.dropdown a,
	.dropdown button {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
		border-radius: 8px;
		transition: background 0.2s;
		text-decoration: none;
		color: var(--text-primary);
		width: 100%;
		text-align: left;
	}

	.dropdown a:hover,
	.dropdown button:hover {
		background: var(--bg-hover);
	}

	@media (max-width: 768px) {
		header {
			padding: 0 8px;
		}

		.search-form {
			display: none;
		}

		.logo span {
			display: none;
		}

		.upload-btn span {
			display: none;
		}

		.upload-btn {
			padding: 8px 12px;
		}
	}
</style>
