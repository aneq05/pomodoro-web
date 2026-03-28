import { DEFAULT_PRESET_MINUTES } from '../../shared/constants'
import { secondsFromMinutes } from '../../shared/time'
import type { TimerMode, TimerSnapshot } from '../../shared/types'

const MODE_ORDER: TimerMode[] = ['focus', 'short', 'long']
const MODE_TO_INDEX: Record<TimerMode, number> = {
	focus: 0,
	short: 1,
	long: 2,
}

const isValidMinuteValue = (value: number) => Number.isFinite(value) && value > 0

export const getTimerModeLabel = (mode: TimerMode) => {
	switch (mode) {
		case 'short':
			return 'Short break'
		case 'long':
			return 'Long break'
		default:
			return 'Focus'
	}
}

export class PomodoroEngine {
	private state: TimerSnapshot

	constructor(presetMinutes: readonly number[] = DEFAULT_PRESET_MINUTES) {
		const presetsSeconds = presetMinutes.map(secondsFromMinutes)
		this.state = {
			mode: 'focus',
			presetsSeconds,
			activePresetIndex: 0,
			remainingSeconds: presetsSeconds[0],
			sessionsCompleted: 0,
			breaksCompleted: 0,
		}
	}

	getSnapshot(): TimerSnapshot {
		return {
			...this.state,
			presetsSeconds: [...this.state.presetsSeconds],
		}
	}

	setPresetMinutes(minutes: number[]) {
		if (minutes.length !== 3) return false
		if (minutes.some((value) => !isValidMinuteValue(value))) return false

		this.state.presetsSeconds = minutes.map(secondsFromMinutes)
		const currentIndex = Math.min(this.state.activePresetIndex, this.state.presetsSeconds.length - 1)
		this.state.activePresetIndex = currentIndex
		this.state.remainingSeconds = this.state.presetsSeconds[currentIndex]
		this.state.mode = MODE_ORDER[currentIndex] ?? 'focus'
		return true
	}

	selectPreset(index: number) {
		if (!Number.isInteger(index)) return false
		if (index < 0 || index >= this.state.presetsSeconds.length) return false

		this.state.activePresetIndex = index
		this.state.mode = MODE_ORDER[index] ?? this.state.mode
		this.state.remainingSeconds = this.state.presetsSeconds[index]
		return true
	}

	startMode(mode: TimerMode) {
		const presetIndex = MODE_TO_INDEX[mode]
		this.state.mode = mode
		this.state.activePresetIndex = presetIndex
		this.state.remainingSeconds = this.state.presetsSeconds[presetIndex]
	}

	tick() {
		if (this.state.remainingSeconds <= 0) {
			return 'idle' as const
		}

		this.state.remainingSeconds -= 1
		if (this.state.remainingSeconds > 0) {
			return 'running' as const
		}

		if (this.state.mode === 'focus') {
			this.state.sessionsCompleted += 1
		} else {
			this.state.breaksCompleted += 1
		}
		return 'completed' as const
	}
}
