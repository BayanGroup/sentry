import React from "react";

var Count = React.createClass({
  propTypes: {
    value: React.PropTypes.any.isRequired
  },

  numberFormats: [
      [1000000000, 'b'],
      [1000000, 'm'],
      [1000, 'k']
  ],

  floatFormat(number, places) {
      var multi = Math.pow(10, places);
      return parseInt(number * multi, 10) / multi;
  },

  formatNumber(number){
      var b, x, y, o, p;

      number = parseInt(number, 10);

      /*eslint no-cond-assign:0*/
      for (var i = 0; (b = this.numberFormats[i]); i++){
          x = b[0];
          y = b[1];
          o = Math.floor(number / x);
          p = number % x;
          if (o > 0) {
              if (o / 10 > 1 || !p)
                  return '' + o + y;
              return '' + this.floatFormat(number / x, 1) + y;
          }
      }
      return '' + number;
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.value !== nextProps.value;
  },

  render() {
    return (
      <span>{this.formatNumber(this.props.value)}</span>
    );
  }
});

export default Count;
