import { describe, expect, it } from 'vitest'
import { PomodoroEngine } from './pomodoroEngine'

describe('PomodoroEngine', () => {
	it('starts with focus preset selected', () => {
		const engine = new PomodoroEngine([25, 5, 15])
		const snapshot = engine.getSnapshot()
		expect(snapshot.mode).toBe('focus')
		expect(snapshot.remainingSeconds).toBe(1500)
	})

	it('switches to selected mode and preset', () => {
		const engine = new PomodoroEngine([25, 5, 15])
		engine.startMode('short')
		const snapshot = engine.getSnapshot()
		expect(snapshot.mode).toBe('short')
		expect(snapshot.remainingSeconds).toBe(300)
	})

	it('increments completed sessions when focus timer finishes', () => {
		const engine = new PomodoroEngine([1, 1, 1])
		engine.startMode('focus')

		for (let i = 0; i < 59; i += 1) {
			expect(engine.tick()).toBe('running')
		}
		expect(engine.tick()).toBe('completed')
		expect(engine.getSnapshot().sessionsCompleted).toBe(1)
	})

	it('validates custom presets', () => {
		const engine = new PomodoroEngine([25, 5, 15])
		expect(engine.setPresetMinutes([30, 10, 20])).toBe(true)
		expect(engine.setPresetMinutes([25, 0, 15])).toBe(false)
	})
})
