<script lang="ts">
	import { Video } from 'lucide-svelte';
	import { language, translations } from '$lib/i18n';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	$: lang = $language;
	$: t = translations[lang];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.ok) {
			window.location.href = '/';
		} else {
			error = data.error || (lang === 'ru' ? 'Ошибка входа' : 'Login failed');
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>{t.email} - LineTube</title>
</svelte:head>
<div class="background">
	<div class="auth-page">
		<div class="auth-card">
			<div class="logo">
				<Video size={48} />
				<h1>LineTube</h1>
			</div>

			<h2>{t.signIn}</h2>

			<form on:submit={handleSubmit}>
				{#if error}
					<div class="error">{error}</div>
				{/if}

				<div class="form-group">
					<label for="email">{t.email}</label>
					<input
						id="email"
						bind:value={email}
						placeholder={lang === 'ru' ? 'Введите ваш логин' : 'Enter your login'}
						disabled={loading}
					/>
				</div>

				<div class="form-group">
					<label for="password">{t.password}</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						placeholder={lang === 'ru' ? 'Введите ваш пароль' : 'Enter your password'}
						disabled={loading}
					/>
				</div>

				<button type="submit" class="btn-primary" disabled={loading}>
					{loading ? (lang === 'ru' ? 'Вход...' : 'Signing in...') : t.signIn}
				</button>
			</form>

			<p class="switch">
				{t.dontHaveAccount} <a href="/register">{t.signUp}</a>
			</p>
		</div>
	</div>
</div>
<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		
		
	}
	.background {
    	background: url(/uploads/logo.png)  320px 0px; /* Параметры фона */
		
		
	}


	.auth-card {
		background: #1b0303b2;
		backdrop-filter: blur(3px);
		padding: 48px;
		border-radius: 16px;
		width: 100%;
		max-width: 440px;
		border: 1px solid var(--border);
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		margin-bottom: 32px;
	}

	.logo h1 {
		font-size: 38px;
		font-weight: 700;
	}

	h2 {
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 24px;
		text-align: center;
	}

	.error {
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 14px;
		
	}


	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-size: 14px;
		font-weight: 500;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 15px;
	}

	button[type='submit'] {
		width: 100%;
		background: #0270ff80;
		padding: 14px;
		font-size: 16px;
		font-weight: 500;
		margin-top: 8px;
		backdrop-filter:blur(3px);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.switch {
		text-align: center;
		margin-top: 24px;
		color: var(--text-secondary);
		font-size: 14px;
	}

	.switch a {
		color: var(--accent);
		text-decoration: none;
	}

	.switch a:hover {
		text-decoration: underline;
	}
</style>
