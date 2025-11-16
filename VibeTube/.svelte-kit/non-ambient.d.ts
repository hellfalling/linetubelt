
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/register" | "/api/comments" | "/api/comments/[id]" | "/api/comments/[id]/heart" | "/api/comments/[id]/like" | "/api/comments/[id]/pin" | "/api/liked" | "/api/liked/videos" | "/api/likes" | "/api/studio" | "/api/studio/comments" | "/api/studio/stats" | "/api/subscriptions" | "/api/users" | "/api/users/[id]" | "/api/user" | "/api/user/update" | "/api/videos" | "/api/videos/[id]" | "/api/videos/[id]/update" | "/api/watch-history" | "/channel" | "/channel/23" | "/channel/[id]" | "/fakechannel" | "/fakechannel/[id]" | "/follow" | "/game" | "/history" | "/liked" | "/login" | "/my-videos" | "/register" | "/search" | "/settings" | "/studio" | "/studio/analytics" | "/studio/comments" | "/studio/edit" | "/studio/edit/[id]" | "/studio/videos" | "/trending" | "/upload" | "/watch-later" | "/watch" | "/watch/17" | "/watch/18" | "/watch/[id]";
		RouteParams(): {
			"/api/comments/[id]": { id: string };
			"/api/comments/[id]/heart": { id: string };
			"/api/comments/[id]/like": { id: string };
			"/api/comments/[id]/pin": { id: string };
			"/api/users/[id]": { id: string };
			"/api/videos/[id]": { id: string };
			"/api/videos/[id]/update": { id: string };
			"/channel/[id]": { id: string };
			"/fakechannel/[id]": { id: string };
			"/studio/edit/[id]": { id: string };
			"/watch/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/auth/me": Record<string, never>;
			"/api/auth/register": Record<string, never>;
			"/api/comments": { id?: string };
			"/api/comments/[id]": { id: string };
			"/api/comments/[id]/heart": { id: string };
			"/api/comments/[id]/like": { id: string };
			"/api/comments/[id]/pin": { id: string };
			"/api/liked": Record<string, never>;
			"/api/liked/videos": Record<string, never>;
			"/api/likes": Record<string, never>;
			"/api/studio": Record<string, never>;
			"/api/studio/comments": Record<string, never>;
			"/api/studio/stats": Record<string, never>;
			"/api/subscriptions": Record<string, never>;
			"/api/users": { id?: string };
			"/api/users/[id]": { id: string };
			"/api/user": { id?: string };
			"/api/user/update": Record<string, never>;
			"/api/videos": { id?: string };
			"/api/videos/[id]": { id: string };
			"/api/videos/[id]/update": { id: string };
			"/api/watch-history": Record<string, never>;
			"/channel": { id?: string };
			"/channel/23": Record<string, never>;
			"/channel/[id]": { id: string };
			"/fakechannel": { id?: string };
			"/fakechannel/[id]": { id: string };
			"/follow": Record<string, never>;
			"/game": Record<string, never>;
			"/history": Record<string, never>;
			"/liked": Record<string, never>;
			"/login": Record<string, never>;
			"/my-videos": Record<string, never>;
			"/register": Record<string, never>;
			"/search": Record<string, never>;
			"/settings": Record<string, never>;
			"/studio": { id?: string };
			"/studio/analytics": Record<string, never>;
			"/studio/comments": Record<string, never>;
			"/studio/edit": { id?: string };
			"/studio/edit/[id]": { id: string };
			"/studio/videos": Record<string, never>;
			"/trending": Record<string, never>;
			"/upload": Record<string, never>;
			"/watch-later": Record<string, never>;
			"/watch": { id?: string };
			"/watch/17": Record<string, never>;
			"/watch/18": Record<string, never>;
			"/watch/[id]": { id: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/auth/me" | "/api/auth/me/" | "/api/auth/register" | "/api/auth/register/" | "/api/comments" | "/api/comments/" | `/api/comments/${string}` & {} | `/api/comments/${string}/` & {} | `/api/comments/${string}/heart` & {} | `/api/comments/${string}/heart/` & {} | `/api/comments/${string}/like` & {} | `/api/comments/${string}/like/` & {} | `/api/comments/${string}/pin` & {} | `/api/comments/${string}/pin/` & {} | "/api/liked" | "/api/liked/" | "/api/liked/videos" | "/api/liked/videos/" | "/api/likes" | "/api/likes/" | "/api/studio" | "/api/studio/" | "/api/studio/comments" | "/api/studio/comments/" | "/api/studio/stats" | "/api/studio/stats/" | "/api/subscriptions" | "/api/subscriptions/" | "/api/users" | "/api/users/" | `/api/users/${string}` & {} | `/api/users/${string}/` & {} | "/api/user" | "/api/user/" | "/api/user/update" | "/api/user/update/" | "/api/videos" | "/api/videos/" | `/api/videos/${string}` & {} | `/api/videos/${string}/` & {} | `/api/videos/${string}/update` & {} | `/api/videos/${string}/update/` & {} | "/api/watch-history" | "/api/watch-history/" | "/channel" | "/channel/" | "/channel/23" | "/channel/23/" | `/channel/${string}` & {} | `/channel/${string}/` & {} | "/fakechannel" | "/fakechannel/" | `/fakechannel/${string}` & {} | `/fakechannel/${string}/` & {} | "/follow" | "/follow/" | "/game" | "/game/" | "/history" | "/history/" | "/liked" | "/liked/" | "/login" | "/login/" | "/my-videos" | "/my-videos/" | "/register" | "/register/" | "/search" | "/search/" | "/settings" | "/settings/" | "/studio" | "/studio/" | "/studio/analytics" | "/studio/analytics/" | "/studio/comments" | "/studio/comments/" | "/studio/edit" | "/studio/edit/" | `/studio/edit/${string}` & {} | `/studio/edit/${string}/` & {} | "/studio/videos" | "/studio/videos/" | "/trending" | "/trending/" | "/upload" | "/upload/" | "/watch-later" | "/watch-later/" | "/watch" | "/watch/" | "/watch/17" | "/watch/17/" | "/watch/18" | "/watch/18/" | `/watch/${string}` & {} | `/watch/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/l.png" | "/robots.txt" | "/uploads/.gitkeep" | "/uploads/logo.png" | "/uploads/secondlogo.jpg" | "/uploads/thumb_12_1762869091906.png" | "/uploads/thumb_12_1762870439260.jpg" | "/uploads/thumb_12_1762871118192.png" | "/uploads/thumb_12_1762871186248.png" | "/uploads/thumb_12_1763037081825.png" | "/uploads/thumb_12_1763133355501.png" | "/uploads/thumb_16_1762871746459.jpg" | "/uploads/thumb_1_1762787641619.rar" | "/uploads/thumb_1_1762791241472.jpg" | "/uploads/thumb_23_1762956802128.png" | "/uploads/thumb_23_1762956958094.png" | "/uploads/thumb_26_1763051008085.jpg" | "/uploads/thumb_26_1763051358135.png" | "/uploads/thumb_3_1762855006288.gif" | "/uploads/thumb_4_1762807266681.png" | "/uploads/thumb_4_1762807702790.gif" | "/uploads/thumb_4_1762853259766.png" | "/uploads/thumb_4_1762860820199.png" | "/uploads/thumb_5_1762805700400.jpg" | "/uploads/thumb_5_1762805700400.mp4" | "/uploads/thumb_9_1762868643028.jpg" | "/uploads/thumb_9_1763039167051.jpg" | "/uploads/users/avatar_12_1762868165433.png" | "/uploads/users/avatar_1_1762719304436.png" | "/uploads/users/avatar_1_1762719304436AbendLegend.png" | "/uploads/users/avatar_22_1762967646092.png" | "/uploads/users/avatar_23_1762956668396.jpeg" | "/uploads/users/avatar_24_1762968431978.png" | "/uploads/users/avatar_26_1763044172016.jpg" | "/uploads/users/avatar_2_1762789532846.png" | "/uploads/users/banner_12_1762868165440.png" | "/uploads/users/banner_22_1762967646101.jpg" | "/uploads/users/banner_23_1762956668403.webp" | "/uploads/users/banner_24_1762968431987.png" | "/uploads/users/banner_26_1763044172025.jpg" | "/uploads/video_10_1762869329120.mp4" | "/uploads/video_12_1762869091906.mp4" | "/uploads/video_12_1762870439260.mp4" | "/uploads/video_12_1762871118192.mkv" | "/uploads/video_12_1762871186248.mp4" | "/uploads/video_12_1763037081825.mp4" | "/uploads/video_12_1763133355501.mp4" | "/uploads/video_19_1762871504334.mp4" | "/uploads/video_1_1762787468871.rar" | "/uploads/video_1_1762791241472.mp4" | "/uploads/video_1_1762799215715.mp4" | "/uploads/video_1_1762805386243.mp4" | "/uploads/video_1_1763047830431.mp4" | "/uploads/video_23_1762956802128.mp4" | "/uploads/video_23_1762956958094.mp4" | "/uploads/video_24_1762968482521.mp4" | "/uploads/video_24_1762968665633.mp4" | "/uploads/video_26_1763051008085.mp4" | "/uploads/video_26_1763051358135.mp4" | "/uploads/video_27_1763073980844.mp4" | "/uploads/video_3_1762805575727.mp4" | "/uploads/video_4_1762807266681.webm" | "/uploads/video_4_1762807702790.mp4" | "/uploads/video_4_1762853259766.mp4" | "/uploads/video_4_1762860820199.mp4" | "/uploads/video_9_1762868643028.mp4" | "/uploads/video_9_1763039167051.mp4" | string & {};
	}
}