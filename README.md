# react-scrollable-tabs
Scrollable tabs allow navigation between content.

![ScreenShot](https://s3-ap-southeast-1.amazonaws.com/custo.furniture/ezgif-3-83ce3824c870.gif)

## Basic usage
```javascript
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



}

```

## Contribution

**Issues** are welcome. Please add a screenshot of bug and code snippet. Quickest way to solve issue is to reproduce it on one of the examples.

**Pull requests** are welcome. If you want to change API or making something big better to create issue and discuss it first. Before submiting PR please run ```eslint .``` Also all eslint fixes are welcome.
