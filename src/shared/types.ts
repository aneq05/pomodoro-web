export type TimerMode = 'focus' | 'short' | 'long'

export interface TimerSnapshot {
	mode: TimerMode
	presetsSeconds: number[]
	activePresetIndex: number
	remainingSeconds: number
	sessionsCompleted: number
	breaksCompleted: number
}

export interface Task {
	id: number
	text: string
	done: boolean
	selected: boolean
}

export interface TaskSummary {
	done: number
	remaining: number
	total: number
	progressPercent: number
}
