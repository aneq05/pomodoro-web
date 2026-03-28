export const formatClockTime = (date: Date) => {
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	return `${hours}:${minutes}:${seconds}`
}

export const formatTimer = (totalSeconds: number) => {
	const normalized = Math.max(totalSeconds, 0)
	const minutes = String(Math.floor(normalized / 60)).padStart(2, '0')
	const seconds = String(normalized % 60).padStart(2, '0')
	return `${minutes}:${seconds}`
}

export const formatPresetLabel = formatTimer

export const secondsFromMinutes = (minutes: number) => Math.round(minutes * 60)
