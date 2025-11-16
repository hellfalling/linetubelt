export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/channel/23": [3],
		"/channel/[id]": [4],
		"/fakechannel/[id]": [5],
		"/follow": [6],
		"/game": [7],
		"/history": [8],
		"/liked": [9],
		"/login": [10],
		"/my-videos": [11],
		"/register": [12],
		"/search": [13],
		"/settings": [14],
		"/studio": [15],
		"/studio/analytics": [16],
		"/studio/comments": [17],
		"/studio/edit/[id]": [18],
		"/studio/videos": [19],
		"/trending": [20],
		"/upload": [21],
		"/watch-later": [25],
		"/watch/17": [22],
		"/watch/18": [23],
		"/watch/[id]": [24]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';