import React, { useReducer, useEffect, useState } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API, graphqlOperation, Auth} from 'aws-amplify';
import { listRealtors } from './graphql/queries';
import { onCreateRealtor } from './graphql/subscriptions';
import { createRealtor as CreateRealtor, deleteRealtor as DeleteRealtor, updateRealtor as UpdateRealtor } from './graphql/mutations';
import { List, Input, Button, Upload } from 'antd';
import Container from './Container'
import { UploadOutlined } from '@ant-design/icons';

// TODO:
// 1. photos need to upload to s3
// 2. get files name and store as arrays in photos

const initState = {
	realtors: [],
	loading: true,
	error: false,
	form: {
		street1: '', 
		street2: '', 
		city: '', 
		state: '', 
		zipcode: '',
		neighborhood: '', 
		salesPrice: '',
		bedrooms: '',
		photos: '',
		bathrooms: '',
		garageSize: '',
		squareFeet: '',
		lotSize: '',
		description: ''
	}
}

const props = {
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  transformFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const img = document.createElement('img');
        img.src = reader.result;
        img.onload = () => {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = 'red';
          ctx.textBaseline = 'middle';
          ctx.fillText('Ant Design', 20, 20);
          canvas.toBlob(resolve);
        };
      };
    });
  },
};

const styles = {
	input: {marginBottom: 10},
	item: {textAligh: 'left'},
	p: {color: '#1890ff'},
}

function App() {
	const [user, updateUser] = useState(null)
	let CLIENT_ID;

	useEffect(() => {
		Auth.currentAuthenticatedUser()
		.then(user => updateUser(user))
		.catch(err => console.log(err))
	}, [])

	if(user) {
		const { signInUserSession: {idToken: { payload }} } = user
		// change this to cognito user id
		CLIENT_ID = payload.sub;
	}

	const [state, dispatch] = useReducer(reducer, initState);

	async function fetchRealtor() {
		try {
			const realtorData = await API.graphql(graphqlOperation(listRealtors));
			dispatch({ type: 'SET_REALTORS', realtors: realtorData.data.listRealtors.items });
		} catch (err) {
			console.log('error: ', err);
			dispatch({ type: 'ERROR' });
		}
	}

	async function createRealtor() {
		const { form } = state
		if (!form.street1 || !form.street2) return alert('Please enter street1 and street2')
		const realtor = { ...form, clientId: CLIENT_ID, dateListed: Date.now()}
		dispatch({ type: 'ADD_REALTOR', realtor })
		dispatch({ dispatch: 'RESET_FORM'})
		try{
			await API.graphql(graphqlOperation(CreateRealtor, { input: realtor }))
			console.log('successfully created realtor!')
		} catch (err) {
			console.log('error', err)
		}
	}

	async function deleteRealtor({ id }) {
		const index = state.realtors.findIndex(n => n.id === id)
		const realtors = [...state.realtors.slice(0, index), ...state.realtors.slice(index + 1 )]
		dispatch({ type: 'SET_REALTORS', realtors });
		try {
			await API.graphql(graphqlOperation(DeleteRealtor, { input: {id} }))
			console.log('realtor successfully deleted!')
		} catch (err) {
			console.log('error', err)
		}
	}

	async function updateRealtor(realtor) {
		const index = state.realtors.findIndex(n => n.id === realtor.id)
		// const realtors = [...state.realtors]
		// realtors[index].completed = !NodeIterator.completed
		// dispatch({ type: 'SET_REALTORS', realtors })
		// try{
		// 	await API.graphql(graphqlOperation(UpdateRealtor, { input: realtors[index] }))
		// 	console.log('realtor successfully updated!')
		// } catch (err) {
		// 	console.log('error: ', err)
		// }
	}

	function onChange(e) {
		dispatch({ type: 'SET_INPUT', name: e.target.name, value: e.target.value })
	}

	function reducer(state, action) {
		switch(action.type) {
			case 'SET_REALTORS':
				return { ...state, realtors: action.realtors, loading: false }
			case 'ADD_REALTOR':
				return { ...state, realtors: [action.realtor, ...state.realtors ]}
			case 'RESET_FORM':
				return { ...state, form: initState.form }
			case 'SET_INPUT':
				return { ...state, form: { ...state.form, [action.name]: action.value }}
			case 'Error':
				return {...state, loading: false, error: true }
			default:
				return state
		}
	}

	function renderItem(item) {
		return (
			<List.Item
				style={styles.item}
				actions={[
					<p style={styles.p} onClick={() => deleteRealtor(item)}>Delete</p>,
					<p style={styles.p} onClick={() => updateRealtor(item)}>Edit</p>
				]}
			>
				<List.Item.Meta
                  title={item.description}
                />
			</List.Item>
		)
	}

	useEffect(() => {
		fetchRealtor()
		const subscription = API.graphql(graphqlOperation(onCreateRealtor)).subscribe({
			next: realtorData => {
				const realtor = realtorData.value.data.onCreateRealtor
				if(CLIENT_ID === realtor.clientId) return
					dispatch({ type: 'ADD_REALTOR', realtor })
			}
		})
		return () => subscription.unsubscribe()
	}, [])

	return (
		<div >
			<AmplifySignOut />
			<Container>
			<h1>REALTOR WEBSITE</h1>
			<Input 
				onChange={onChange}
				value={state.form.street1}
				placeholder="Street 1"
				name="street1"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.street2}
				placeholder="Street 2"
				name="street2"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.city}
				placeholder="City"
				name="city"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.state}
				placeholder="State"
				name="state"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.zipcode}
				placeholder="Zipcode"
				name="zipcode"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.neighborhood}
				placeholder="Neighborhood"
				name="neighborhood"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.salesPrice}
				placeholder="Sales Price"
				name="salesPrice"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.bedrooms}
				placeholder="Bedrooms"
				name="bedrooms"
				style={styles.input}
			/>
			<Upload {...props}>
				<Button>
					<UploadOutlined /> Upload
				</Button>
			</Upload>
			<Input 
				onChange={onChange}
				value={state.form.bathrooms}
				placeholder="Bathrooms"
				name="bathrooms"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.garageSize}
				placeholder="Garage Size"
				name="garageSize"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.squareFeet}
				placeholder="Square Feet"
				name="squareFeet"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.lotSize}
				placeholder="Lot Size"
				name="lotSize"
				style={styles.input}
			/>
			<Input 
				onChange={onChange}
				value={state.form.description}
				placeholder="Description"
				name="description"
				style={styles.input}
			/>
			<Button
				onClick={createRealtor}
				type="primary"
			>Create</Button>

			<List 
				loading={state.loading}
				dataSource={state.realtors}
				renderItem={renderItem}
			/>
			</Container>
		</div>
	)
}

export default withAuthenticator(App, true);
