import React from "React";
import styled from "styled-components";
import {THEMES} from './constants';


const FIXED_VARS = {
	tabMarginRight: 16,
	touchMoveSpeed: 2.8,
	transitionDelay: 300,
}

const TabsContainer = styled.div`

	width: 100%;
	height:100%;
	display:flex;
	flex-direction:column;
	position:relative;
	overflow-x:hidden;


		&::before {
			position:absolute;
			top:0px;
			left:0px;
			right:0px;
			bottom:0px;
		    content: "";
		    width:100%;
		    height:100%;
		    box-shadow:	inset 90px 0 70px -45px #f1f1f0, inset -90px 0 70px -45px #f1f1f0;
		    pointer-events: none;
		}

`;


const TabButtonContainer = styled.div`

	width:1000%;
	padding-bottom:15px;
	display:flex;
	overflow-x:auto;
	margin-left:calc(50% - ${props => props.offset}px);
	align-items:center;
	user-select: none;

	`;

	//transition: margin-left 500ms ease-in-out;

const TabButton = styled.div`

	margin-right: ${FIXED_VARS.tabMarginRight}px;
	padding-bottom:1px;
	font-size: ${props => props.active || props.highlight ? `2rem` : '1.1rem'};
	border-bottom: ${props => props.active  ? `2px solid ${THEMES.main.primary}` : ''};
	font-weight: ${props => props.active || props.highlight ? `bold` : 'normal'};
	color: ${props => props.active || props.highlight ? `${THEMES.main.primary}` : 'black'};
	opacity: ${props => props.highlight ? `0.8` : '1'};
	user-select: none;
`;





const TabContent = styled.div`

	flex:1;
	text-align:center;

`;


export class Tabs extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			activeIndex: null,
			offset: null,
			movingOffset: null,
			isTouching: false,
			movingTabIndexToHighlight: null,
			touchOrigin: {
				x: null,
				y: null
			},
			touchMove: {
				x: null,
				y: null
			}
		}
		this.children = [];
		this.tabrefs = [];
		this.tabButtonContainerRef = React.createRef();
		this.TabsContainerRef = React.createRef();


	}




	static getDerivedStateFromProps(nextProps, prevState){



		let activeIndex = null;

		for(let i=0;i<nextProps.children.length;i++){


			if(nextProps.children[i].props.eventKey === nextProps.activeKey){
				activeIndex = i;
				break;
			}else{

			}
		}

		activeIndex = (activeIndex === null ? 0 : activeIndex);

		return {
			activeIndex
		}
	}

	onTabClick(eventKey, i){

		this.clearTouchMargins();

		this.props.onSelect(eventKey)
	}


	renderTabContent(){
		//movingTabIndexToHighlight
		if(this.state.isTouching && this.state.movingTabIndexToHighlight !== null){
			return this.children[this.state.movingTabIndexToHighlight]
		}else{
			return this.children[this.state.activeIndex];
		}

	}

	render(){

		this.addChilderns();


		return (

				<TabsContainer ref={this.TabsContainerRef}>
						<TabButtonContainer id="TabButtonContainer" ref={this.tabButtonContainerRef} offset={this.state.offset} moving={this.state.isTouching}>
						{this.children.slice().map((e , i) => {
							return ( <TabButton
												ref={(r) => {this.tabrefs[i] = r }}
												onClick={this.onTabClick.bind(this, e.props.eventKey, i)}
												key={i}
												highlight={i === this.state.movingTabIndexToHighlight}
												active={this.state.movingTabIndexToHighlight === null && e.props.eventKey === this.props.activeKey}>
												{e.props.title}
											</TabButton>)
						})}
						</TabButtonContainer>
						<TabContent>
							 {this.renderTabContent()}
						</TabContent>
				</TabsContainer>

			)
	}


	clearTouchMargins(){
		this.tabButtonContainerRef.current.style.marginLeft  = null;
		this.tabButtonContainerRef.current.style.transform  = null;
		this.prevMoveX = null;
		this.tabContaierMarginLeft = null;
		this.setState({
			movingOffset: null
		})
	}

	applyTransitionPropsToRef(){
		this.tabButtonContainerRef.current.style.transition = `all ${FIXED_VARS.transitionDelay}ms ease-out`;
	}

	removeTransitionPropsFromRef(){
		this.tabButtonContainerRef.current.style.transition = null;
	}

	setOffset(activeIndex){


		// clear touch margins
		this.clearTouchMargins();

		// set transition propery
		this.applyTransitionPropsToRef();


		this.setState({
			offset: this.calculateOffSet(activeIndex)
		},()=>{

			setTimeout(()=>{
				this.removeTransitionPropsFromRef();
			},FIXED_VARS.transitionDelay)

		})

	}


	calculateOffSet(activeIndex){

		

		let offset = 0;
		for(let i=0;i<=activeIndex;i++){

			if(i === activeIndex){
				offset += (this.tabrefs[i].offsetWidth) / 2
				break;
			}else{
				offset += this.tabrefs[i].offsetWidth + FIXED_VARS.tabMarginRight
			}


		}

		return offset;

	}

	unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

	handleTouchStart(e){
		let xDown = this.unify(e).clientX;
		let yDown = this.unify(e).clientY;


		this.setState({
			isTouching: true,
			touchOrigin: {
				x: xDown,
				y: yDown
			}
		})
	}

	detectNearestTab(ML,dir){

		ML = ML.toFixed(2);



		let tabContaierMarginLeftForAllTabs = [];

		for(let i=0;i<this.children.length;i++){
			tabContaierMarginLeftForAllTabs.push((this.TabsContainerRef.current.offsetWidth/2) - this.calculateOffSet(i));
		}



		let neartab = null;


		for(let i=0;i<tabContaierMarginLeftForAllTabs.length;i++){

			if(dir === "=>"){

				let DELAY_OFFSET = 80;

				if(ML >=  tabContaierMarginLeftForAllTabs[i]-DELAY_OFFSET){
					neartab = i;
					break;
				}
			}



			if(dir === "<="){

				let reversedIndex = Math.abs(i-(tabContaierMarginLeftForAllTabs.length-1));

				let DELAY_OFFSET = 10;

				if(ML <=  tabContaierMarginLeftForAllTabs[reversedIndex]+DELAY_OFFSET){
					neartab = reversedIndex;
					break;
				}
			}


		}



		if(neartab === null && dir === "=>"){
			neartab = tabContaierMarginLeftForAllTabs.length-1;
		}
		if(neartab === null && dir === "<="){
			neartab = 0;
		}



		return neartab;




	}

	handleTouchMove(e){


		if(!this.state.isTouching) return;



		let xDown = this.unify(e).clientX;
		let yDown = this.unify(e).clientY;



		this.tabContaierMarginLeft  = (this.tabContaierMarginLeft === null ? (this.TabsContainerRef.current.offsetWidth/2) - this.state.offset : this.tabContaierMarginLeft); // get current margin (calculated)

		let hasReachEnd = (() => {

			if(this.state.activeIndex === this.children.length-1){
				return true;
			}else{

				let tabContaierMarginLeft_whenLast = (this.TabsContainerRef.current.offsetWidth/2) - this.calculateOffSet(this.children.length-1)

				// console.log(`tabContaierMarginLeft_whenFirst ${tabContaierMarginLeft_whenLast}`);
				// console.log(`movingOffset ${this.state.movingOffset}`)
				//

				if(tabContaierMarginLeft_whenLast >= this.state.movingOffset){
					return true;
				}else{
					return false;
				}

			}

		})();




		let hasReachStart = (() => {

			let tabContaierMarginLeft_whenFirst = (this.TabsContainerRef.current.offsetWidth/2) - this.calculateOffSet(0)


			//console.log(tabContaierMarginLeft_whenFirst)

			// console.log(`tabContaierMarginLeft_whenFirst ${tabContaierMarginLeft_whenFirst}`);
			// console.log(`movingOffset ${this.state.movingOffset}`)

			if( tabContaierMarginLeft_whenFirst <= this.state.movingOffset){
				return true;
			}else{
				return false;
			}


		})() ;




		if(this.prevMoveX){

			if(xDown < this.prevMoveX && !hasReachEnd){
 				//moving left
				//console.log("moving side =>")

				// this.setState({
				// 	offset: this.state.offset+=FIXED_VARS.touchMoveSpeed
				// },()=>{
				// })



			  const ML = this.tabContaierMarginLeft-=FIXED_VARS.touchMoveSpeed;
				let neartab = this.detectNearestTab(ML,"=>");


			  this.tabButtonContainerRef.current.style.marginLeft = `${ML}px`;

				// this.tabrefs[neartab].style.transition = `font-size 100ms ease-in-out`;
				// setTimeout(()=>{
				// 	this.tabrefs[neartab].style.transition = null;
				// },1000)

				this.setState({
					movingOffset: this.tabButtonContainerRef.current.style.marginLeft.replace("px",""),
					movingTabIndexToHighlight: neartab
				})

			}

			if(xDown > this.prevMoveX && !hasReachStart){
				// moving right
				//console.log("moving side <=")

				// this.setState({
				// 	offset: this.state.offset-=FIXED_VARS.touchMoveSpeed
				// },()=>{
				// })


				const ML = this.tabContaierMarginLeft+=FIXED_VARS.touchMoveSpeed;
				let neartab = this.detectNearestTab(ML,"<=");

				this.tabButtonContainerRef.current.style.marginLeft = `${ML}px`

				// this.tabrefs[neartab].style.transition = `font-size 100ms ease-in-out`;
				// setTimeout(()=>{
				// 	this.tabrefs[neartab].style.transition = null;
				// },1000)


				this.setState({
					movingOffset: this.tabButtonContainerRef.current.style.marginLeft.replace("px",""),
					movingTabIndexToHighlight: neartab
				})

			}
			this.prevMoveX = xDown;

		}else{
			this.prevMoveX = xDown;

			if(this.state.touchOrigin.x < this.prevMoveX){
				//console.log("initial moving side =>")

			}else{
				//console.log("initial moving side <=")
			}

		}



	}

	handleTouchEnd(e){



		let xDown = this.unify(e).clientX;
		let yDown = this.unify(e).clientY;

		let xDiff = this.state.touchOrigin.x - xDown;
    	let yDiff = this.state.touchOrigin.y - yDown;

		 if ( xDiff > 0 ) {
			 //left swipe

		 }else{
			 //right swipe
		 }


		if(this.state.isTouching && this.state.movingTabIndexToHighlight !== null){
			// set transition propery
			this.applyTransitionPropsToRef();
			this.onTabClick(this.children[this.state.movingTabIndexToHighlight].props.eventKey)

			setTimeout(()=>{
				this.removeTransitionPropsFromRef();
			},FIXED_VARS.transitionDelay)
		}

		this.setState({
			isTouching: false,
			touchOrigin: {
				x: null,
				y: null
			},
			movingTabIndexToHighlight: null
		})
	}


	registerEventHandlers(){

	 //The basic idea is that we're going to detect the direction of the motion between the "touchstart" (or "mousedown") event and the "touchend" (or "mouseup") and then update


		this.tabButtonContainerRef.current.addEventListener('touchstart', this.handleTouchStart.bind(this) , false);
		this.tabButtonContainerRef.current.addEventListener('mousedown', this.handleTouchStart.bind(this) , false);

		this.tabButtonContainerRef.current.addEventListener('touchmove', this.handleTouchMove.bind(this), false);


		this.tabButtonContainerRef.current.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
		this.tabButtonContainerRef.current.addEventListener('mouseup', this.handleTouchEnd.bind(this), false);


	}

	addChilderns(){

		this.children = [];

		if(!Array.isArray(this.props.children)){
			this.children.push(this.props.children)
		}



		for(let i=0;i<this.props.children.length;i++){
			this.children.push(this.props.children[i])
		}

	}

	componentDidUpdate(previousProps, previousState){
		if(previousState.activeIndex !== this.state.activeIndex){
			this.setOffset(this.state.activeIndex)
		}
	}


	componentDidMount(){
			this.setOffset(this.state.activeIndex)
			this.registerEventHandlers()

	}

}


export class Tab extends React.Component{



	render(){
		return (
			<React.Fragment>
				{this.props.children}
			</React.Fragment>
		);
	}

}
