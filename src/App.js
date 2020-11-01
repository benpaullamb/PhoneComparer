import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {    
    render() {
        return (
            <div>
                Hi
                <button onClick={() => this.test()}>Test</button>
            </div>
        );
    }

    async test() {
        const res = await fetch('/search?s=huawei');
        const json = await res.json();
        console.log(json);
    }
}

ReactDOM.render(<App/>, document.querySelector('#root'));