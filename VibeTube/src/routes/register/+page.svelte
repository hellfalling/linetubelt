<script lang="ts">
	import { Video } from 'lucide-svelte';
	import { language, translations } from '$lib/i18n';
	import { onMount } from 'svelte';

	let username = '';
	let email = '';
	let password = '';
	let error = '';
	let loading = false;
	let captchaAnswer = '';
	let captchaQuestion = '';
	let captchaSolution = '';

	$: lang = $language;
	$: t = translations[lang];

	// Простые математические вопросы для капчи
	const mathQuestions = [
		{ question: '2 + 3', answer: '5' },
		{ question: '7 - 4', answer: '3' },
		{ question: '6 + 2', answer: '8' },
		{ question: '9 - 5', answer: '4' },
		{ question: '3 + 7', answer: '10' },
		{ question: '8 - 3', answer: '5' },
		{ question: '4 + 6', answer: '10' },
		{ question: '5/10', answer: '0,5' },
		{ question: '10 - 2', answer: '8' }
	];

	// Вопросы на текстовую логику
	const textQuestions = [
		{ 
			question: lang === 'ru' ? 'Напишите третью букву англ алфавита/Write the third letter of alphabet' : 'Напишите третью букву англ алфавита/Write the third letter of alphabet', 
			answer: lang === 'ru' ? 'c' : 'c' 
		},
		{ 
			question: lang === 'ru' ? 'Имя сайта/Name of this site.' : 'Имя сайта/Name of this site.', 
			answer: 'linetube' 
		},
		{ 
			question: lang === 'ru' ? 'Сколько лап у кошки? (цифрой)/How many paws does a cat have? (digit)' : 'Сколько лап у кошки? (цифрой)/How many paws does a cat have? (digit)', 
			answer: '4' 
		},
		{ 
			question: lang === 'ru' ? 'Какой цвет у травы? (маленькими буквами, на английском)' : 'What color is grass? (lowercase)', 
			answer: lang === 'ru' ? 'green' : 'green' 
		}
	];

	function generateCaptcha() {
		const allQuestions = [...mathQuestions, ...textQuestions];
		const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
		captchaQuestion = randomQuestion.question;
		captchaSolution = randomQuestion.answer.toLowerCase().trim();
		captchaAnswer = '';
	}

	onMount(() => {
		generateCaptcha();
	});

	function refreshCaptcha() {
		generateCaptcha();
	}

	function validateCaptcha(): boolean {
		return captchaAnswer.toLowerCase().trim() === captchaSolution;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		// Проверка капчи
		if (!validateCaptcha()) {
			error = lang === 'ru' ? 'Неверный ответ на проверочный вопрос' : 'Incorrect answer to verification question';
			loading = false;
			generateCaptcha(); // Генерируем новую капчу при ошибке
			return;
		}

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					username, 
					email, 
					password 
				})
			});

			const data = await res.json();

			if (res.ok) {
				window.location.href = '/';
			} else {
				error = data.error || (lang === 'ru' ? 'Ошибка регистрации' : 'Registration failed');
			}
		} catch (err) {
			error = lang === 'ru' ? 'Ошибка соединения' : 'Connection error';
		}

		loading = false;
		generateCaptcha(); // Генерируем новую капчу после отправки
	}
</script>

<svelte:head>
	<title>{t.welcome_new} LineTube</title>
</svelte:head>
<div class="background">
	<div class="auth-page">
		<div class="auth-card">
			<div class="logo">
				<Video size={48} />
				<h1>LineTube</h1>
			</div>

			<div class="createaccountlabel"><h2>{lang === 'ru' ? 'Создать аккаунт' : 'Create Account'}</h2></div>

			<form on:submit={handleSubmit}>
				{#if error}
					<div class="error">{error}</div>
				{/if}


				<div class="form-group">
					<label for="username">{t.username}</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						required
						placeholder={lang === 'ru' ? 'Выберите имя пользователя' : 'Choose a username'}
						disabled={loading}
					/>
				</div>

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
						minlength="6"
						placeholder={lang === 'ru' ? 'Выберите пароль (минимум 6 символов)' : 'Choose a password (min 6 characters)'}
						disabled={loading}
					/>
				</div>

				<!-- Капча -->
				<div class="form-group captcha-group">
					<label for="captcha">
						{lang === 'ru' ? 'Проверка:' : 'Verification:'} {captchaQuestion}
						<button type="button" class="refresh-captcha" on:click={refreshCaptcha} disabled={loading}>
							{lang === 'ru' ? 'Обновить' : 'Refresh'}
						</button>
					</label>
					<input
						id="captcha"
						type="text"
						bind:value={captchaAnswer}
						required
						placeholder={lang === 'ru' ? 'Введите ответ' : 'Enter the answer'}
						disabled={loading}
					/>
					<div class="captcha-hint">
						{lang === 'ru' ? 'Ответьте на вопрос для подтверждения, что вы не робот' : 'Answer the question to confirm you are not a robot'}
					</div>
				</div>
				<label for="username">{t.rules}</label>

				<button type="submit" class="btn-primary" disabled={loading}>
					{loading ? (lang === 'ru' ? 'Создание аккаунта...' : 'Creating account...') : t.signUp}
				</button>
			</form>

			<p class="switch">
				{t.alreadyHaveAccount} <a href="/login">{t.signIn}</a>
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
		font-size: 28px;
		font-weight: 700;
	}

	h2 {
		font-family: 'Roboto', sans-serif;
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
	.createaccountlabel {
		background: rgba(51, 90, 177, 0.2);
		padding: 0px;
		border-radius: 4px;
		margin-bottom: 16px;
	
	}

	.form-group {
		margin-bottom: 20px;
	}

	.captcha-group label {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.refresh-captcha {
		background: var(--accent);
		color: white;
		border: none;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		cursor: pointer;
	}

	.refresh-captcha:hover:not(:disabled) {
		opacity: 0.8;
	}

	.refresh-captcha:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.captcha-hint {
		font-size: 12px;
		color: var(--text-secondary);
		margin-top: 4px;
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
		padding: 14px;
		font-size: 16px;
		font-weight: 500;
		margin-top: 8px;
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