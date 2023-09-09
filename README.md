# dynamic-list-react

Inspired by Larry Tesler's work, this package contains a react component to render a list of input items that can be added to, updated and removed from without switching between edit and view modes and without any buttons (optionally, a delete button can be shown for each item).

## Installation

`npm install dynamic-list-react`

## Usage

### Basic Example

![Basic Example Illustration](https://github.com/repetitioestmaterstudiorum/dynamic-list-react/raw/main/assets/basic-example.gif)

```javascript
import React from 'react';
import { DynamicList, type HandleInputChange } from 'dynamic-list-react';

export function ExampleDynamicList() {
	const data = getCurrentData();
	const defaultItem = { name: '' };

	const updateKeyValue = (_id: string, key: string, value: any) => {
		const currentData = getCurrentData();
		const itemToUpdate = currentData.find(item => item._id === _id);
		if (itemToUpdate) {
			itemToUpdate[key] = value;
			setData(currentData);
		}
	}

	const removeItem = (_id: string) => {
		const currentData = getCurrentData();
		setData(currentData.filter(item => item._id !== _id));
	}

	const addItem = (item: ItemType) => {
		const currentData = getCurrentData();
		setData(currentData.concat(item));
	}

	const InputComponent = (item: ItemType, handleInputChange: HandleInputChange<ItemType>) => (
		<div key={item._id}>
			<input
				placeholder="Name"
				value={item.name}
				onChange={e => handleInputChange(item._id, 'name', e.target.value)}
			/>
		</div>
	);

	return (
		<DynamicList<ItemType>
			renderComponent={InputComponent}
			dataProp={data}
			addItem={addItem}
			updateKeyValue={updateKeyValue}
			removeItem={removeItem}
			defaultItem={defaultItem}
		/>
	);
}

function getCurrentData() {
		return JSON.parse(localStorage.getItem('storageKey') || '[]') as ItemType[];
	}

function setData(data: ItemType[]) {
	localStorage.setItem('storageKey', JSON.stringify(data));
}

type ItemType = Record<string, any>;
```

### Advanced Example

![Advanced Example Illustration](https://github.com/repetitioestmaterstudiorum/dynamic-list-react/raw/main/assets/advanced-example.gif)

```javascript
import React from 'react'
import { DynamicList, type HandleDelete, type HandleInputChange } from 'dynamic-list-react'

export function ExampleDynamicList() {
	const data = getCurrentData()
	const defaultItem = {
		firstName: '',
		lastName: '',
		score: '',
	}

	const updateKeyValue = (_id: string, key: string, value: any) => {
		const currentData = getCurrentData()
		const itemToUpdate = currentData.find((item) => item._id === _id)
		if (itemToUpdate) {
			itemToUpdate[key] = value
			setData(currentData)
		}
	}

	const removeItem = (_id: string) => {
		const currentData = getCurrentData()
		setData(currentData.filter((item) => item._id !== _id))
	}

	const addItem = (item: ItemType) => {
		const currentData = getCurrentData()
		setData(currentData.concat(item))
	}

	const InputComponent = (
		item: ItemType,
		handleInputChange: HandleInputChange<ItemType>,
		handleDelete: HandleDelete,
		isLastItem: boolean
	) => (
		<div key={item._id}>
			<input
				placeholder='First Name'
				value={item.firstName}
				onChange={(e) => handleInputChange(item._id, 'firstName', e.target.value)}
			/>
			<input
				placeholder='Last Name'
				value={item.lastName}
				onChange={(e) => handleInputChange(item._id, 'lastName', e.target.value)}
			/>
			<input
				placeholder='Score'
				value={item.score}
				onChange={(e) => handleInputChange(item._id, 'score', e.target.value)}
			/>
			{isLastItem ? null : <button onClick={() => handleDelete(item._id)}>Delete</button>}
		</div>
	)

	return (
		<DynamicList<ItemType>
			renderComponent={InputComponent}
			dataProp={data}
			addItem={addItem}
			updateKeyValue={updateKeyValue}
			removeItem={removeItem}
			defaultItem={defaultItem}
			getRandomId={getRandomId}
		/>
	)
}

function getCurrentData() {
	return JSON.parse(localStorage.getItem('storageKey') || '[]') as ItemType[]
}

function setData(data: ItemType[]) {
	localStorage.setItem('storageKey', JSON.stringify(data))
}

function getRandomId() {
	// e.g. crypto.randomUUID() or uuidv4()
	return Date.now().toString()
}

type ItemType = Record<string, any>
```

## Larry Tesler: No Modes

> One of Mr Tesler's firmest beliefs was that computer systems should stop using "modes", which were common in software design at the time.
> Modes allow users to switch between functions on software and apps but make computers both time-consuming and complicated.
> So strong was this belief that Mr Tesler's website was called "nomodes.com", his Twitter handle was "@nomodes", and even his car's registration plate was "No Modes".

Source: https://www.bbc.com/news/world-us-canada-51567695
