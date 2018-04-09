import React from 'react';

// Simple stateful component with arrow function event handler
export default class ComponentStatefulWithArrowFunctionHandler extends React.Component {

    constructor() {
        super();
        this.state = {
            ticks: 0
        };
    }

    componentDidMount() {
        setInterval(() => this.tick(), 1000);
    }

    tick() {
        this.setState((prevState) => ({
            ticks: prevState.ticks + 1
        }));
    }

    // Arrow function (no need for onClick={this.clicked.bind(this)}), 
    // 'this' will be the present enclosing scope (class)
    clicked = () => {
        this.setState((prevState) => ({
            ticks: 0
        }));
    };

    render() {
        return (<div onClick={this.clicked}>ComponentStateFulWithArrowFunctionHandler {this.props.message} since {this.state.ticks}<br/></div>);
    }
}