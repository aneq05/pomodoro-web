export const pickRandomQuote = (
	quotes: readonly string[],
	random: () => number = Math.random,
	previousQuote = '',
) => {
	if (quotes.length === 0) return ''
	if (quotes.length === 1) return quotes[0]

	const nextIndex = Math.floor(random() * quotes.length)
	const nextQuote = quotes[nextIndex]
	if (nextQuote !== previousQuote) {
		return nextQuote
	}

	const fallbackIndex = (nextIndex + 1) % quotes.length
	return quotes[fallbackIndex]
}
