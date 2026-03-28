import { describe, expect, it } from 'vitest'
import { formatClockTime, formatTimer, secondsFromMinutes } from './time'

describe('time utilities', () => {
	it('formats clock as HH:MM:SS', () => {
		const date = new Date('2026-03-28T09:07:05')
		expect(formatClockTime(date)).toBe('09:07:05')
	})

	it('formats timer as MM:SS and clamps negatives', () => {
		expect(formatTimer(1500)).toBe('25:00')
		expect(formatTimer(-10)).toBe('00:00')
	})

	it('converts minutes to seconds', () => {
		expect(secondsFromMinutes(15)).toBe(900)
	})
})
