/* src/Public.js */
import React, { useState, useEffect } from 'react'
import Container from './Container'
import { API, graphqlOperation} from 'aws-amplify';
import { listRealtors } from './graphql/queries';

import { Input } from 'antd';
import { Radio } from 'antd';

const { Search } = Input;

const initState = {
	realtors: [],
	loading: true,
	error: false,
	form: {
		id: '',
		city: '', 
		state: '', 
		zipcode: '',
		bedrooms: '',
		bathrooms: '',
		squareFeet: ''
	},
	seleted: ''
}

function Public() {
	const [state] = useState(initState);
	const [realtor, setRealtor] = useState();

	function onChange(seletedValue) {
		initState.seleted = seletedValue.target.value;
		console.log('checked = ', seletedValue);		
	}

	async function fetchRealtor() {
		try {
			let realtorData =  await API.graphql(graphqlOperation(listRealtors)); 
			setRealtor(realtorData.data.listRealtors.items);
		} catch (err) {
			console.log('error: ', err);
		}
	}

	async function searchRealtor(value) {
		if(state.seleted === "") return alert('Please select search key');
		if(!value ) return alert('Search text is empty');
	}
	
	useEffect(() => {
		fetchRealtor()
	}, [])

  return (
		
    <Container>
      <h1>Search</h1>
			<Search
				placeholder="input search text"
				enterButton="Search"
				size="large"
				onSearch={value => searchRealtor(value)}
			/>
			Search Keys:
			<Radio.Group onChange={onChange}>
        <Radio value={"MLS"}>MLS</Radio>
        <Radio value={"City"}>City</Radio>
        <Radio value={"State"}>State</Radio>
				<Radio value={"Zipcode"}>Zipcode</Radio>
				<Radio value={"Bedrooms"}>Bedrooms</Radio>
				<Radio value={"Bathrooms"}>Bathrooms</Radio>
				<Radio value={"Square Feet"}>Square Feet</Radio>
      </Radio.Group>   
		</Container>
  )
}

export default Public