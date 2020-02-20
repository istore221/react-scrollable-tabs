import React from "react";
import styled from 'styled-components';
import {Tabs, Tab} from './Tabs';


const AppContainer = styled.div`

	width: 100%;
	height:100%;

`;



export default class ReactScrollableTabsTest extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			activeKey: 'width',
			tabs: ['Model','Packages','Colours','Wheels','Leather','Equipment','Personalise']
		}
	}

	onChangeTab(k){
		this.setState({
			activeKey: k
		})
	}

	render(){

			return (

					<AppContainer>

						<Tabs activeKey={this.state.activeKey} onSelect={k => this.onChangeTab(k)}>

							{this.state.tabs.map(t=>{
								return (
									<Tab key={t.toLowerCase()} eventKey={t.toLowerCase()} title={t}>
											<React.Fragment>{t} tab</React.Fragment>
									 </Tab>
								)
							})}

						</Tabs>

					</AppContainer>


				)

	}

	componentDidMount(){
		// setTimeout(()=>{
		// 	this.setState({
		// 		tabs: [...this.state.tabs,"testing added","new tab"]
		// 	})
		// },5000)
	}

}

