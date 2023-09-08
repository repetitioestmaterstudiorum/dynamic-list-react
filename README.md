# dynamic-list-react

Inspired by Larry Tesler's work, this package includes a react component to render a list of input items that can be added, updated and removed without switching between edit and view modes.

## Installation

`npm install dynamic-list-react`

## Usage

### Basic Example

```javascript
import React from 'react';
import { DynamicList, type HandleInputChange } from 'dynamic-list-react';

export function ExampleDynamicList() {
	type ItemType = Record<string, any>;

	function getCurrentData() {
		return JSON.parse(localStorage.getItem('storageKey') || '[]') as ItemType[];
	}

	function setData(data: ItemType[]) {
		localStorage.setItem('storageKey', JSON.stringify(data));
	}

	const data = getCurrentData();
	const defaultItem = { name: '' };

	function updateKeyValue(_id: string, key: string, value: any) {
		const currentData = getCurrentData();
		const itemToUpdate = currentData.find(item => item._id === _id);
		if (itemToUpdate) {
			itemToUpdate[key] = value;
			setData(currentData);
		}
	}

	function removeItem(_id: string) {
		const currentData = getCurrentData();
		setData(currentData.filter(item => item._id !== _id));
	}

	function addItem(item: ItemType) {
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
```

### Advanced Example

```javascript
import React from 'react';
import {
	DynamicList,
	type HandleDelete,
	type HandleInputChange,
} from 'dynamic-list-react';

export function ExampleDynamicList() {
	type ItemType = Record<string, any>;

	function getCurrentData() {
		return JSON.parse(localStorage.getItem('storageKey') || '[]') as ItemType[];
	}

	function setData(data: ItemType[]) {
		localStorage.setItem('storageKey', JSON.stringify(data));
	}

	const data = getCurrentData();
	const defaultItem = {
		firstName: '',
		lastName: '',
		score: '',
	};

	function updateKeyValue(_id: string, key: string, value: any) {
		const currentData = getCurrentData();
		const itemToUpdate = currentData.find(item => item._id === _id);
		if (itemToUpdate) {
			itemToUpdate[key] = value;
			setData(currentData);
		}
	}

	function removeItem(_id: string) {
		const currentData = getCurrentData();
		setData(currentData.filter(item => item._id !== _id));
	}

	function addItem(item: ItemType) {
		const currentData = getCurrentData();
		setData(currentData.concat(item));
	}

	const InputComponent = (
		item: ItemType,
		handleInputChange: HandleInputChange<ItemType>,
		handleDelete: HandleDelete,
		isLastItem: boolean
	) => (
		<div key={item._id}>
			<input
				placeholder="First Name"
				value={item.firstName}
				onChange={e => handleInputChange(item._id, 'firstName', e.target.value)}
			/>
			<input
				placeholder="Last Name"
				value={item.lastName}
				onChange={e => handleInputChange(item._id, 'lastName', e.target.value)}
			/>
			<input
				placeholder="Score"
				value={item.score}
				onChange={e => handleInputChange(item._id, 'score', e.target.value)}
			/>
			{!isLastItem ? <button onClick={() => handleDelete(item._id)}>Delete</button> : null}
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
```

## Larry Tesler: No Modes

> One of Mr Tesler's firmest beliefs was that computer systems should stop using "modes", which were common in software design at the time.
> Modes allow users to switch between functions on software and apps but make computers both time-consuming and complicated.
> So strong was this belief that Mr Tesler's website was called "nomodes.com", his Twitter handle was "@nomodes", and even his car's registration plate was "No Modes".

Source: https://www.bbc.com/news/world-us-canada-51567695
