import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PhoneSpecs from './PhoneSpecs';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneA: {},
            phoneB: {}
        };
    }
    
    async componentDidMount() {
        const resA = await fetch(`/phone?url=${encodeURIComponent('https://www.gsmarena.com/oneplus_8t-10420.php')}`);
        const jsonA = await resA.json();
        console.log(jsonA);

        const resB = await fetch(`/phone?url=${encodeURIComponent('https://www.gsmarena.com/google_pixel_5-10386.php')}`);
        const jsonB = await resB.json();
        console.log(jsonB);
        
        this.setState({
            phoneA: jsonA,
            phoneB: jsonB
        });
    }
    
    render() {
        return (
            <div className="grid">
                <div className="col">
                    <PhoneSpecs phone={this.state.phoneA}/>
                </div>
                <div className="col">
                    <PhoneSpecs phone={this.state.phoneB}/>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.querySelector('#root'));