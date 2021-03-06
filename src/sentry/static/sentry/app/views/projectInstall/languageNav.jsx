import React from "react";

var LanguageNav = React.createClass({
  getInitialState() {
    return {
      isVisible: this.props.active || false
    };
  },

  toggle() {
    this.setState({isVisible: !this.state.isVisible});
  },

  render() {
    var {isVisible} = this.state;
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item list-group-header">
            <a onClick={this.toggle} style={{display: 'block'}}>
              <span className="pull-right">
                {isVisible ?
                  <span className="icon-minus"/>
                :
                  <span className="icon-plus"/>
                }
              </span>
              <strong>{this.props.name}</strong>
            </a>
          </li>
          <span style={{
            display: (isVisible ? 'block' : 'none')
          }}>
            {this.props.children}
          </span>
        </ul>
      </div>
    );
  }
});

export default LanguageNav;
