export const getById = <T extends HTMLElement>(id: string) => {
	const element = document.getElementById(id)
	if (!element) {
		throw new Error(`Missing required element with id "${id}"`)
	}
	return element as T
}

export const queryAll = <T extends Element>(selector: string) =>
	Array.from(document.querySelectorAll(selector)) as T[]
