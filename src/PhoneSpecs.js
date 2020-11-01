import React, { Component } from 'react';
import SpecSection from './SpecSection';

export default class PhoneSpecs extends Component {    
    render() {
        const includedSections = { ...this.props.phone };
        delete includedSections['Name'];
        delete includedSections['Photo'];

        const sections = Object.keys(includedSections).map(key => {
            return (
                <SpecSection title={key} specs={this.props.phone[key]} key={key}/>
            );
        });

        return (
            <div className="phone">
                <span className="phone__name">{this.props.phone['Name']}</span>
                <img src={this.props.phone['Photo']} alt="Photo of the phone" className="phone__photo"/>

                {sections}
            </div>
        );
    }
}