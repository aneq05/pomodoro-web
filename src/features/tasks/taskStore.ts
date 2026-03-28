import type { Task, TaskSummary } from '../../shared/types'

const cloneTask = (task: Task): Task => ({ ...task })

export class TaskStore {
	private readonly tasks: Task[]
	private nextTaskId = 1
	private showDoneOnly = false

	constructor(initialTasks: readonly string[] = []) {
		this.tasks = initialTasks
			.map((task) => task.trim())
			.filter((task) => task.length > 0)
			.map((task) => this.createTask(task))
	}

	private createTask(text: string): Task {
		const task: Task = {
			id: this.nextTaskId,
			text,
			done: false,
			selected: false,
		}
		this.nextTaskId += 1
		return task
	}

	add(text: string) {
		const normalized = text.trim()
		if (!normalized) return false
		this.tasks.unshift(this.createTask(normalized))
		return true
	}

	toggleSelection(taskId: number) {
		const task = this.tasks.find((item) => item.id === taskId)
		if (!task) return false
		task.selected = !task.selected
		return true
	}

	markSelectedDone() {
		const selected = this.tasks.filter((task) => task.selected)
		if (selected.length === 0) return false
		selected.forEach((task) => {
			task.done = true
			task.selected = false
		})
		return true
	}

	deleteSelected() {
		let deletedCount = 0
		for (let index = this.tasks.length - 1; index >= 0; index -= 1) {
			if (this.tasks[index].selected) {
				this.tasks.splice(index, 1)
				deletedCount += 1
			}
		}
		return deletedCount
	}

	toggleDoneVisibility() {
		this.showDoneOnly = !this.showDoneOnly
		return this.showDoneOnly
	}

	isShowingDoneOnly() {
		return this.showDoneOnly
	}

	getAll() {
		return this.tasks.map(cloneTask)
	}

	getVisible() {
		if (this.showDoneOnly) {
			return this.tasks.filter((task) => task.done).map(cloneTask)
		}
		return this.tasks.filter((task) => !task.done).map(cloneTask)
	}

	getSummary(): TaskSummary {
		const done = this.tasks.filter((task) => task.done).length
		const total = this.tasks.length
		const remaining = Math.max(total - done, 0)
		const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0
		return {
			done,
			total,
			remaining,
			progressPercent,
		}
	}
}
