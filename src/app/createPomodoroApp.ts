import { getById, queryAll } from './dom'
import { PomodoroEngine, getTimerModeLabel } from '../features/timer/pomodoroEngine'
import { TaskStore } from '../features/tasks/taskStore'
import { pickRandomQuote } from '../features/quotes/quotes'
import { DEFAULT_PRESET_MINUTES, DEFAULT_TASKS, MOTIVATIONAL_QUOTES } from '../shared/constants'
import { formatClockTime, formatPresetLabel, formatTimer } from '../shared/time'

const QUOTE_INTERVAL_MS = 4 * 60 * 1000

const buildStatsMessage = (done: number, total: number, progressPercent: number) => {
	if (total === 0) return 'Add your first task to start.'
	if (progressPercent === 100) return 'Excellent work, everything is done.'
	if (progressPercent >= 65) return 'Strong pace. You are close to done.'
	if (done > 0) return 'Momentum is building. Keep going.'
	return 'Pick one task and start your first focus block.'
}

export const createPomodoroApp = () => {
	const elements = {
		clock: getById<HTMLParagraphElement>('clock'),
		clockQuote: getById<HTMLParagraphElement>('clock-quote'),
		startFocus: getById<HTMLButtonElement>('start-focus'),
		startShort: getById<HTMLButtonElement>('start-short'),
		startLong: getById<HTMLButtonElement>('start-long'),
		stopSession: getById<HTMLButtonElement>('stop-session'),
		sessionCount: getById<HTMLElement>('session-count'),
		breakCount: getById<HTMLElement>('break-count'),
		sessionTimer: getById<HTMLElement>('session-timer'),
		timerMode: getById<HTMLElement>('timer-mode'),
		timerPanel: getById<HTMLElement>('timer-panel'),
		timerSettings: getById<HTMLButtonElement>('timer-settings'),
		timerModal: getById<HTMLElement>('timer-modal'),
		timerModalError: getById<HTMLElement>('timer-modal-error'),
		timerModalSave: getById<HTMLButtonElement>('timer-modal-save'),
		timerModalCancel: getById<HTMLButtonElement>('timer-modal-cancel'),
		timerInput1: getById<HTMLInputElement>('timer-input-1'),
		timerInput2: getById<HTMLInputElement>('timer-input-2'),
		timerInput3: getById<HTMLInputElement>('timer-input-3'),
		tasksDoneCount: getById<HTMLElement>('tasks-done-count'),
		tasksRemaining: getById<HTMLElement>('tasks-remaining'),
		todoList: getById<HTMLUListElement>('todo-list'),
		todoInput: getById<HTMLInputElement>('todo-input'),
		todoAdd: getById<HTMLButtonElement>('todo-add'),
		tasksDoneToggle: getById<HTMLButtonElement>('tasks-done-toggle'),
		tasksDelete: getById<HTMLButtonElement>('tasks-delete'),
		statsSessionNumber: getById<HTMLElement>('stats-session-number'),
		statsDone: getById<HTMLElement>('stats-done'),
		statsTotal: getById<HTMLElement>('stats-total'),
		statsProgressBar: getById<HTMLElement>('stats-progress-bar'),
		statsMessage: getById<HTMLElement>('stats-message'),
		presetButtons: queryAll<HTMLButtonElement>('.timer-preset'),
	}

	const timer = new PomodoroEngine(DEFAULT_PRESET_MINUTES)
	const taskStore = new TaskStore(DEFAULT_TASKS)
	let timerIntervalId: number | null = null

	const stopTimerLoop = () => {
		if (timerIntervalId === null) return
		window.clearInterval(timerIntervalId)
		timerIntervalId = null
		elements.timerPanel.classList.remove('is-running')
	}

	const renderClock = () => {
		elements.clock.textContent = formatClockTime(new Date())
	}

	const renderQuote = () => {
		elements.clockQuote.textContent = pickRandomQuote(
			MOTIVATIONAL_QUOTES,
			Math.random,
			elements.clockQuote.textContent ?? '',
		)
	}

	const renderTasks = () => {
		const visibleTasks = taskStore.getVisible()
		elements.todoList.innerHTML = ''

		visibleTasks.forEach((task) => {
			const item = document.createElement('li')
			item.className = 'task-item'
			item.dataset.taskId = String(task.id)
			if (task.selected) item.classList.add('is-selected')
			if (task.done) item.classList.add('is-done')

			const text = document.createElement('span')
			text.className = 'task-text'
			text.textContent = task.text
			item.appendChild(text)
			elements.todoList.appendChild(item)
		})
	}

	const render = () => {
		const timerSnapshot = timer.getSnapshot()
		const summary = taskStore.getSummary()

		elements.sessionTimer.textContent = formatTimer(timerSnapshot.remainingSeconds)
		elements.timerMode.textContent = getTimerModeLabel(timerSnapshot.mode)
		elements.sessionCount.textContent = String(timerSnapshot.sessionsCompleted)
		elements.breakCount.textContent = String(timerSnapshot.breaksCompleted)

		elements.statsSessionNumber.textContent = String(timerSnapshot.sessionsCompleted)
		elements.statsDone.textContent = String(summary.done)
		elements.statsTotal.textContent = String(summary.total)
		elements.statsProgressBar.style.width = `${summary.progressPercent}%`
		elements.statsMessage.textContent = buildStatsMessage(summary.done, summary.total, summary.progressPercent)

		elements.tasksDoneCount.textContent = String(summary.done)
		elements.tasksRemaining.textContent = String(summary.remaining)
		elements.tasksDoneToggle.classList.toggle('is-active', taskStore.isShowingDoneOnly())
		elements.tasksDoneToggle.title = taskStore.isShowingDoneOnly() ? 'Showing done tasks' : 'Showing to-do tasks'

		timerSnapshot.presetsSeconds.forEach((durationSeconds, index) => {
			const button = elements.presetButtons[index]
			if (!button) return
			button.textContent = formatPresetLabel(durationSeconds)
			button.classList.toggle('is-active', timerSnapshot.activePresetIndex === index)
		})

		elements.timerPanel.classList.toggle('is-running', timerIntervalId !== null)
		renderTasks()
	}

	const startTimerLoop = () => {
		if (timerIntervalId !== null) return
		elements.timerPanel.classList.add('is-running')
		timerIntervalId = window.setInterval(() => {
			const tickResult = timer.tick()
			render()
			if (tickResult !== 'running') {
				stopTimerLoop()
			}
		}, 1000)
	}

	const startMode = (mode: 'focus' | 'short' | 'long') => {
		stopTimerLoop()
		timer.startMode(mode)
		render()
		startTimerLoop()
	}

	const openTimerModal = () => {
		const snapshot = timer.getSnapshot()
		elements.timerInput1.value = String(Math.round(snapshot.presetsSeconds[0] / 60))
		elements.timerInput2.value = String(Math.round(snapshot.presetsSeconds[1] / 60))
		elements.timerInput3.value = String(Math.round(snapshot.presetsSeconds[2] / 60))
		elements.timerModalError.textContent = ''
		elements.timerModal.classList.add('is-open')
		elements.timerModal.setAttribute('aria-hidden', 'false')
		elements.timerInput1.focus()
	}

	const closeTimerModal = () => {
		elements.timerModal.classList.remove('is-open')
		elements.timerModal.setAttribute('aria-hidden', 'true')
		elements.timerModalError.textContent = ''
	}

	elements.startFocus.addEventListener('click', () => startMode('focus'))
	elements.startShort.addEventListener('click', () => startMode('short'))
	elements.startLong.addEventListener('click', () => startMode('long'))
	elements.stopSession.addEventListener('click', stopTimerLoop)

	elements.presetButtons.forEach((button, index) => {
		button.addEventListener('click', () => {
			stopTimerLoop()
			timer.selectPreset(index)
			render()
		})
	})

	elements.timerSettings.addEventListener('click', openTimerModal)
	elements.timerModalCancel.addEventListener('click', closeTimerModal)
	elements.timerModal.addEventListener('click', (event) => {
		if (event.target === elements.timerModal) {
			closeTimerModal()
		}
	})

	elements.timerModalSave.addEventListener('click', () => {
		const minutes = [elements.timerInput1, elements.timerInput2, elements.timerInput3].map((input) => Number(input.value))
		const hasInvalidValue = minutes.some((value) => !Number.isFinite(value) || value <= 0)
		if (hasInvalidValue) {
			elements.timerModalError.textContent = 'Use three positive numbers.'
			return
		}

		stopTimerLoop()
		const updated = timer.setPresetMinutes(minutes)
		if (!updated) {
			elements.timerModalError.textContent = 'Could not save presets. Try again.'
			return
		}

		closeTimerModal()
		render()
	})

	elements.todoAdd.addEventListener('click', () => {
		const wasAdded = taskStore.add(elements.todoInput.value)
		if (wasAdded) {
			elements.todoInput.value = ''
			elements.todoInput.focus()
			render()
		}
	})

	elements.todoInput.addEventListener('keydown', (event) => {
		if (event.key !== 'Enter') return
		event.preventDefault()
		const wasAdded = taskStore.add(elements.todoInput.value)
		if (!wasAdded) return
		elements.todoInput.value = ''
		render()
	})

	elements.todoList.addEventListener('click', (event) => {
		const target = event.target
		if (!(target instanceof HTMLElement)) return
		const listItem = target.closest<HTMLLIElement>('[data-task-id]')
		if (!listItem) return
		const taskId = Number(listItem.dataset.taskId)
		if (!Number.isFinite(taskId)) return
		taskStore.toggleSelection(taskId)
		render()
	})

	elements.tasksDoneToggle.addEventListener('click', () => {
		const marked = taskStore.markSelectedDone()
		if (!marked) {
			taskStore.toggleDoneVisibility()
		}
		render()
	})

	elements.tasksDelete.addEventListener('click', () => {
		taskStore.deleteSelected()
		render()
	})

	renderClock()
	renderQuote()
	window.setInterval(renderClock, 1000)
	window.setInterval(renderQuote, QUOTE_INTERVAL_MS)
	render()
}
