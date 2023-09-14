import React, { useState, ReactNode } from 'react'

export function DynamicList<T extends { [key: string]: any }>({
	renderComponent,
	dataProp,
	addItem,
	updateKeyValue,
	removeItem,
	defaultItem,
	getRandomId = () => String(Date.now()),
}: DynamicListProps<T>) {
	const defaultItemWithId = {
		...defaultItem,
		_id: defaultItem._id || getRandomId(),
	} as unknown as T

	const initialData = [...(dataProp || []), defaultItemWithId]
	const [data, setData] = useState<Array<T>>(initialData as unknown as T[])

	const numDefaultSetKeys = Object.values(defaultItemWithId).filter(isValueSet).length

	const handleInputChange = (_id: string, key: keyof T, value: any) => {
		const updatedData = [...data]
		const index = updatedData.findIndex((item) => item._id === _id)

		updatedData[index][key] = value

		// If value is for last item that is not in data prop, add it to data prop
		if (index === updatedData.length - 1 && value && !dataProp?.some((item) => item._id === _id)) {
			addItem({ ...updatedData[index] })
		} else {
			// Update data prop of already existing item in data prop
			updateKeyValue(_id, key, value)
		}

		// If there is no item without content (except default set field)
		if (
			updatedData.filter(
				(item) => Object.values(item).filter(isValueSet).length === numDefaultSetKeys
			).length === 0
		) {
			// Add a new line to data
			updatedData.push({ ...defaultItem, _id: getRandomId() } as unknown as T)
		}

		// If more than 1 items without content (except default set field)
		if (
			updatedData.filter(
				(item) => Object.values(item).filter(isValueSet).length === numDefaultSetKeys
			).length > 1
		) {
			// Remove the first one of the two items by _id in data
			updatedData.splice(
				updatedData.findIndex((item) => item._id === _id),
				1
			)
			// Remove the first of the two items by _id in the data prop
			removeItem(_id)
		}

		setData(updatedData)
	}

	const handleDelete = (_id: string) => {
		removeItem(_id)
		setData((prevData) => prevData.filter((prevItem) => prevItem._id !== _id))
	}

	return (
		<>
			{data.map((item) => {
				const isLastItem = item._id === data[data.length - 1]._id
				return renderComponent(item, handleInputChange, handleDelete, isLastItem)
			})}
		</>
	)
}

function isValueSet(value: any) {
	if (value == null) return false // null or undefined
	if (!(typeof value === 'string') && !Array.isArray(value)) {
		console.error('isValueSet only supports null, undefined, string and array')
		return false
	}
	return !!(Array.isArray(value) ? value.length : value)
}

type DynamicListProps<T> = {
	renderComponent: (
		item: T,
		handleInputChange: HandleInputChange<T>,
		handleDelete: HandleDelete,
		isLastItem: boolean
	) => ReactNode
	dataProp?: Array<T>
	addItem: (item: T) => void
	updateKeyValue: (_id: string, key: keyof T, value: any) => void
	removeItem: (_id: string) => void
	defaultItem: Partial<T>
	getRandomId?: () => string
}

export type HandleInputChange<T> = {
	(_id: string, key: keyof T, value: any): void
}

export type HandleDelete = {
	(_id: string): void
}
