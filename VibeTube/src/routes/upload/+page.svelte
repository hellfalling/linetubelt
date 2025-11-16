<script lang="ts">
	import { onMount } from 'svelte';
	import { Upload as UploadIcon, Video, AlertCircle } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { language, translations } from '$lib/i18n';

	let user: any = null;
	let sidebarOpen = true;

	$: lang = $language;
	$: t = translations[lang];
	let title = '';
	let description = '';
	let videoFile: File | null = null;
	let thumbnailFile: File | null = null;
	let uploading = false;
	let error = '';
	let dragOver = false;
	let uploadProgress = 0;

	let captchaAnswer = '';
	let captchaQuestion = '';
	let captchaSolution = '';

	
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

	const MAX_VIDEO_DURATION = 10;
	const MAX_FILE_SIZE = 500;

	const ALLOWED_VIDEO_TYPES = [
		'video/mp4',
		'video/mpeg',
		'video/ogg',
		'video/webm',
		'video/quicktime',
		'video/x-msvideo',
		'video/x-matroska',
		'video/3gpp',
		'video/3gpp2'
	];

	const ALLOWED_EXTENSIONS = [
		'.mp4', '.m4v', '.mov', '.avi', '.wmv', '.flv', 
		'.webm', '.ogv', '.mkv', '.3gp', '.3g2', '.mpeg', 
		'.mpg', '.mpe', '.mpv'
	];

	const bannedKeywords = [
		'порно', 'porno', 'porn', 'onlyfans', 'only fans', 'only-fans',
		'порнография', 'pornography', 'xxx', 'xXXx', 'секс', 'sex',
		'взрослый контент', 'adult content', '18+', 'nsfw',
		'обнаженный', 'nude', 'naked', 'голый', 'голая','гoлый оnlyfаns взрoслый контeнт'
	];

	onMount(async () => {
		const res = await fetch('/api/auth/me');
		if (!res.ok) {
			window.location.href = '/login';
			return;
		}
		const data = await res.json();
		user = data.user;
		generateCaptcha();
	});

	function generateCaptcha() {
		const allQuestions = [...mathQuestions, ...textQuestions];
		const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
		captchaQuestion = randomQuestion.question;
		captchaSolution = randomQuestion.answer.toLowerCase().trim();
		captchaAnswer = '';
	}

	function refreshCaptcha() {
		generateCaptcha();
	}

	function validateCaptcha(): boolean {
		return captchaAnswer.toLowerCase().trim() === captchaSolution;
	}

	function containsBannedContent(text: string): boolean {
		if (!text) return false;
		
		const lowerText = text.toLowerCase();
		return bannedKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
	}

	function isValidVideoFile(file: File): boolean {
		if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
			return true;
		}
		
		const fileName = file.name.toLowerCase();
		return ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
	}

	async function getVideoDuration(file: File): Promise<number> {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.preload = 'metadata';
			
			video.onloadedmetadata = function() {
				window.URL.revokeObjectURL(video.src);
				resolve(video.duration);
			};
			
			video.onerror = function() {
				resolve(0);
			};
			
			video.src = URL.createObjectURL(file);
		});
	}

	async function handleVideoChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			
			if (!isValidVideoFile(file)) {
				error = lang === 'ru' 
					? 'Пожалуйста, выберите видеофайл (MP4, MOV, AVI, WebM и т.д.)'
					: 'Please select a video file (MP4, MOV, AVI, WebM, etc.)';
				videoFile = null;
				input.value = '';
				return;
			}
			
			const fileSizeMB = file.size / (1024 * 1024);
			if (fileSizeMB > MAX_FILE_SIZE) {
				error = lang === 'ru' 
					? `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE}MB`
					: `File too large. Maximum size: ${MAX_FILE_SIZE}MB`;
				videoFile = null;
				input.value = '';
				return;
			}

			try {
				const duration = await getVideoDuration(file);
				const durationMinutes = duration / 60;
				
				if (durationMinutes > MAX_VIDEO_DURATION) {
					error = lang === 'ru'
						? `Видео слишком длинное. Максимальная длительность: ${MAX_VIDEO_DURATION} минут`
						: `Video too long. Maximum duration: ${MAX_VIDEO_DURATION} minutes`;
					videoFile = null;
					input.value = '';
					return;
				}
			} catch (err) {
				console.error('Error checking video duration:', err);
			}

			videoFile = file;
			error = '';
		}
	}

	function handleThumbnailChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			
			if (!file.type.startsWith('image/')) {
				error = lang === 'ru'
					? 'Пожалуйста, выберите файл изображения'
					: 'Please select an image file';
				thumbnailFile = null;
				input.value = '';
				return;
			}
			
			const fileSizeMB = file.size / (1024 * 1024);
			
			if (fileSizeMB > 10) {
				error = lang === 'ru'
					? 'Изображение слишком большое. Максимальный размер: 10MB'
					: 'Image too large. Maximum size: 10MB';
				thumbnailFile = null;
				input.value = '';
				return;
			}
			
			thumbnailFile = file;
			error = '';
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		
		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			
			if (!isValidVideoFile(file)) {
				error = lang === 'ru' 
					? 'Пожалуйста, перетащите видеофайл'
					: 'Please drag a video file';
				return;
			}
			
			const input = document.createElement('input');
			input.type = 'file';
			input.files = e.dataTransfer.files;
			handleVideoChange({ target: input } as any);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		uploadProgress = 0;

		if (!validateCaptcha()) {
			error = lang === 'ru' ? 'Неверный ответ на проверочный вопрос' : 'Incorrect answer to verification question';
			generateCaptcha();
			return;
		}

		if (containsBannedContent(title) || containsBannedContent(description)) {
			error = lang === 'ru' 
				? 'Видео не может быть опубликовано из-за нарушения правил платформы'
				: 'Video cannot be published due to platform policy violation';
			generateCaptcha();
			return;
		}

		if (!videoFile) {
			error = lang === 'ru' ? 'Пожалуйста, выберите видеофайл' : 'Please select a video file';
			return;
		}

		if (!isValidVideoFile(videoFile)) {
			error = lang === 'ru' 
				? 'Неверный тип файла. Пожалуйста, выберите видеофайл'
				: 'Invalid file type. Please select a video file';
			return;
		}

		if (!title.trim()) {
			error = lang === 'ru' ? 'Пожалуйста, введите название' : 'Please enter a title';
			return;
		}

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('description', description);
			formData.append('video', videoFile);
			if (thumbnailFile) {
				formData.append('thumbnail', thumbnailFile);
			}

			const xhr = new XMLHttpRequest();
			
			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					uploadProgress = Math.round((event.loaded / event.total) * 100);
				}
			});

			const uploadPromise = new Promise((resolve, reject) => {
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve(JSON.parse(xhr.responseText));
					} else {
						reject(new Error(xhr.responseText));
					}
				};
				
				xhr.onerror = () => reject(new Error('Network error'));
				xhr.ontimeout = () => reject(new Error('Request timeout'));
			});

			xhr.open('POST', '/api/videos');
			xhr.send(formData);

			const data = await uploadPromise as any;
			window.location.href = `/watch/${data.video.id}`;
			
		} catch (err: any) {
			console.error('Upload error:', err);
			const errorData = JSON.parse(err.message || '{}');
			error = errorData.error || (lang === 'ru' ? 'Ошибка загрузки' : 'Upload failed');
			
			if (errorData.code === 'VIDEO_TOO_LONG') {
				error = lang === 'ru' 
					? 'Видео слишком длинное. Максимальная длительность: 10 минут'
					: 'Video too long. Maximum duration: 10 minutes';
			} else if (errorData.code === 'FILE_TOO_LARGE') {
				error = lang === 'ru'
					? 'Файл слишком большой'
					: 'File too large';
			} else if (errorData.code === 'BANNED_CONTENT') {
				error = lang === 'ru'
					? 'Видео не может быть опубликовано из-за нарушения правил платформы'
					: 'Video cannot be published due to platform policy violation';
			} else if (errorData.code === 'INVALID_FILE_TYPE') {
				error = lang === 'ru'
					? 'Неверный тип файла. Пожалуйста, загрузите видеофайл'
					: 'Invalid file type. Please upload a video file';
			}
		} finally {
			uploading = false;
			uploadProgress = 0;
			generateCaptcha();
		}
	}
</script>

<svelte:head>
	<title>New video! - LineVideo</title>
</svelte:head>

<div class="app">
	<Header {user} onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
	<Sidebar isOpen={sidebarOpen} {user} />
	<main class:sidebar-open={sidebarOpen}>
		<div class="upload-container">
			<div class="upload-card">
				<div class="header">
					<Video size={32} />
					<h1>{t.uploadVideo}</h1>
				</div>

				{#if lang === 'ru'}
				<div class="info-banner">
					<AlertCircle size={16} />
					<span>Максимальная длительность видео: {MAX_VIDEO_DURATION} минут</span>
				</div>
				
				
				{:else}
				<div class="info-banner">
					<AlertCircle size={16} />
					<span>Maximum video duration: {MAX_VIDEO_DURATION} minutes</span>
				</div>
				
				
				{/if}

				<form on:submit={handleSubmit}>
					{#if error}
					
						<div class="error">
							<AlertCircle size={16} />
							{error}
						</div>
						
					{/if}
					
					<div
						class="drop-zone"
						class:drag-over={dragOver}
						role="button"
						tabindex="0"
						on:drop={handleDrop}
						on:dragover={(e) => {
							e.preventDefault();
							dragOver = true;
						}}
						on:dragleave={() => (dragOver = false)}
					>
						<UploadIcon size={48} />
						<p>{t.dragDrop}</p>
						<span>{lang === 'ru' ? 'или' : 'or'}</span>
						<label class="file-label">
							<input type="file" accept="video/*" on:change={handleVideoChange} disabled={uploading} />
							{t.selectFile}
						</label>
						{#if videoFile}
							<p class="file-info">
								{lang === 'ru' ? 'Выбрано' : 'Selected'}: {videoFile.name} 
								({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
							</p>
						{/if}
					</div>

					{#if uploading}
					<div class="progress-container">
						<div class="progress-bar">
							<div class="progress-fill" style={`width: ${uploadProgress}%`}></div>
						</div>
						<span class="progress-text">{uploadProgress}%</span>
					</div>
					{/if}

					<div class="form-group">
						<label for="title">{t.title} *</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							placeholder={lang === 'ru' ? 'Введите название видео' : 'Enter video title'}
							required
							disabled={uploading}
							maxlength="100"
						/>
					</div>

					<div class="form-group">
						<label for="description">{t.description}</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder={lang === 'ru' ? 'Расскажите зрителям о вашем видео' : 'Tell viewers about your video'}
							rows="5"
							disabled={uploading}
							maxlength="5000"
						></textarea>
					</div>

					<div class="form-group">
						<label for="thumbnail">{t.thumbnail} ({lang === 'ru' ? 'необязательно' : 'optional'})</label>
						<input
							id="thumbnail"
							type="file"
							accept="image/*"
							on:change={handleThumbnailChange}
							disabled={uploading}
						/>
						{#if thumbnailFile}
							<p class="file-info">
								{lang === 'ru' ? 'Выбрано' : 'Selected'}: {thumbnailFile.name}
								({(thumbnailFile.size / (1024 * 1024)).toFixed(1)} MB)
							</p>
						{/if}
					</div>

					<div class="form-group captcha-group">
						<label for="captcha">
							{lang === 'ru' ? 'Проверка:' : 'Verification:'} {captchaQuestion}
							<button type="button" class="refresh-captcha" on:click={refreshCaptcha} disabled={uploading}>
								{lang === 'ru' ? 'Обновить' : 'Refresh'}
							</button>
						</label>
						<input
							id="captcha"
							type="text"
							bind:value={captchaAnswer}
							required
							placeholder={lang === 'ru' ? 'Введите ответ' : 'Enter the answer'}
							disabled={uploading}
						/>
						<div class="captcha-hint">
							{lang === 'ru' ? 'Ответьте на вопрос для подтверждения, что вы не робот' : 'Answer the question to confirm you are not a robot'}
						</div>
					</div>
					
					<button type="submit" class="btn-primary" disabled={uploading}>
						{uploading ? t.uploading : t.uploadVideo}
					</button>
					
					
				</form>
				
			</div>
			<div><a href="/studio" class="btn-secondary">{t.studio}</a></div>
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

	main.sidebar-open {
		margin-left: 240px;
	}

	.upload-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 32px 24px;
	}

	.upload-card {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 16px;
		padding: 32px;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	h1 {
		font-size: 28px;
		font-weight: 600;
	}

	.info-banner {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(62, 166, 255, 0.1);
		color: var(--accent);
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 12px;
		font-size: 14px;
		border: 1px solid rgba(62, 166, 255, 0.2);
	}

	.warning-banner {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(255, 193, 7, 0.1);
		color: #ffc107;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		border: 1px solid rgba(255, 193, 7, 0.2);
	}

	.error {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(255, 50, 50, 0.2);
		color: #ff6b6b;
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 14px;
		border: 1px solid rgba(255, 50, 50, 0.3);
	}

	.drop-zone {
		border: 2px dashed var(--border);
		border-radius: 12px;
		padding: 48px;
		text-align: center;
		margin-bottom: 24px;
		transition: all 0.3s;
		cursor: pointer;
	}

	.drop-zone.drag-over {
		border-color: var(--accent);
		background: rgba(62, 166, 255, 0.1);
	}

	.drop-zone p {
		margin: 16px 0 8px;
		color: var(--text-primary);
		font-size: 16px;
	}

	.drop-zone span {
		color: var(--text-secondary);
		font-size: 14px;
	}

	.file-label {
		display: inline-block;
		margin-top: 16px;
		padding: 10px 24px;
		background: var(--accent);
		color: white;
		border-radius: 24px;
		cursor: pointer;
		font-weight: 500;
		transition: background 0.2s;
	}

	.file-label:hover {
		background: var(--accent-hover);
	}

	.file-label input {
		display: none;
	}

	.file-info {
		margin-top: 12px;
		color: var(--accent);
		font-size: 14px;
	}

	.progress-container {
		margin-bottom: 24px;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--border);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 8px;
	}

	.progress-fill {
		height: 100%;
		background: var(--accent);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 14px;
		color: var(--text-secondary);
		text-align: center;
		display: block;
	}

	.form-group {
		margin-bottom: 24px;
	}

	.captcha-group label {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.refresh-captcha {
		background: #ff6b6b;
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

	input[type='text'],
	textarea {
		width: 100%;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 15px;
		resize: vertical;
	}

	input[type='file'] {
		width: 100%;
		padding: 8px;
		border-radius: 8px;
	}

	button[type='submit'] {
		width: 100%;
		padding: 14px;
		font-size: 16px;
		font-weight: 500;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 1024px) {
		main.sidebar-open {
			margin-left: 0;
		}
	}

	@media (max-width: 768px) {
		main {
			padding: 0;
		}

		.upload-container {
			padding: 20px 16px;
		}

		.upload-card {
			padding: 24px 16px;
		}

		h1 {
			font-size: 22px;
		}

		.drop-zone {
			padding: 32px 20px;
		}

		.form-group label {
			font-size: 13px;
		}

		.form-group input,
		.form-group textarea {
			font-size: 15px;
			padding: 10px 12px;
		}
	}

	@media (max-width: 480px) {
		.upload-container {
			padding: 16px 12px;
		}

		.upload-card {
			padding: 20px 12px;
			border-radius: 12px;
		}

		h1 {
			font-size: 20px;
			margin-bottom: 20px;
		}

		.header {
			gap: 12px;
			margin-bottom: 24px;
		}

		.form-actions {
			flex-direction: column;
			gap: 12px;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
			justify-content: center;
		}

		.drop-zone {
			min-height: 180px;
			padding: 24px 16px;
		}

		.drop-zone p {
			font-size: 15px;
		}

		.drop-zone span {
			font-size: 13px;
		}

		.file-info {
			padding: 10px;
		}
	}
</style>