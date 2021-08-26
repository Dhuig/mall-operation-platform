import { httpPlugin } from './http';
import { burryPlugin } from './burry';
import { configPlugin } from './config';
import { filtersPlugin } from './filters';
import { busPlugin } from './bus';
import { tabPlugin } from './tab';
import { printPlugin } from './print';
import { dictPlugin } from './dict';
import { storagePlugin } from './storage';
import { forbidScalingPlugin } from './forbidScaling';

const plugins = [
	configPlugin,
	burryPlugin,
	httpPlugin,
	filtersPlugin,
	busPlugin,
	tabPlugin,
	printPlugin,
	dictPlugin,
	storagePlugin,
	forbidScalingPlugin,
];

export { plugins }
