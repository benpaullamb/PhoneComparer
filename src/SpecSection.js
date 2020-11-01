import React, { Component } from 'react';

export default class SpecSection extends Component {    
    render() {
        let specs;

        if(typeof this.props.specs !== 'object') {
            specs = <span className="specs__spec">{this.props.specs}</span>;
        } else {
            specs = Object.keys(this.props.specs).map(key => {
                return (
                    <span key={`${key}__specs`} className="specs__spec">{key}: {this.props.specs[key]}</span>
                );
            })
        }

        return (
            <div className="specs">
                <span className="specs__title">{this.props.title}</span>
                { specs }
            </div>
        );
    }
}