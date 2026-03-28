import { describe, expect, it } from 'vitest'
import { TaskStore } from './taskStore'

describe('TaskStore', () => {
	it('adds trimmed tasks only', () => {
		const store = new TaskStore()
		expect(store.add('  Ship UI refactor  ')).toBe(true)
		expect(store.add('   ')).toBe(false)
		expect(store.getSummary()).toEqual({
			done: 0,
			remaining: 1,
			total: 1,
			progressPercent: 0,
		})
	})

	it('marks selected tasks as done', () => {
		const store = new TaskStore(['Task A', 'Task B'])
		const [firstTask] = store.getAll()
		store.toggleSelection(firstTask.id)
		expect(store.markSelectedDone()).toBe(true)
		expect(store.getSummary().done).toBe(1)
	})

	it('toggles done-only view', () => {
		const store = new TaskStore(['Task A'])
		const [task] = store.getAll()
		store.toggleSelection(task.id)
		store.markSelectedDone()

		expect(store.getVisible()).toHaveLength(0)
		store.toggleDoneVisibility()
		expect(store.getVisible()).toHaveLength(1)
	})

	it('deletes selected tasks', () => {
		const store = new TaskStore(['Task A', 'Task B'])
		const [, secondTask] = store.getAll()
		store.toggleSelection(secondTask.id)
		expect(store.deleteSelected()).toBe(1)
		expect(store.getSummary().total).toBe(1)
	})
})
