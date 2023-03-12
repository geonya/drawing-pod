export enum AppStates {
	READY = 'READY',
	MOUNTED = 'MOUNTED',
	LOADING = 'LOADING',
	INITAILIZED = 'INITAILIZED',
	CUTSCENE = 'CUTSCENE',
	MENU = 'MENU',
	RUNNING = 'RUNNING',
	EXITING = 'EXITING',
}

import logger from './logger'

export function* appStateMachine(): Generator<AppStates, AppStates, AppStates> {
	let previousState = AppStates.READY
	let currentState = AppStates.READY
	const setState = (newState: AppStates) => {
		previousState = currentState
		currentState = newState
		logger.logInfo(
			'App State Change ! :: Previous state : ' + previousState + ':: New State : ' + newState,
		)
		return newState
	}
	while (true) {
		const nextState = yield currentState
		if (nextState) {
			setState(nextState)
			if (nextState === AppStates.EXITING) {
				return currentState
			}
		}
	}
}
