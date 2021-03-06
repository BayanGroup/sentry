import React from "react/addons";
var TestUtils = React.addons.TestUtils;
import DefinitionList from "app/components/events/interfaces/definitionList";

describe('DefinitionList', function () {
  describe("render", function () {
    it("should render a definition list of key/value pairs", function () {
      var data = [
        ['a', 'x'], ['b', 'y']
      ];
      var elem = TestUtils.renderIntoDocument(<DefinitionList data={data} />);

      var dts = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dt');
      expect(dts[0].getDOMNode().textContent).to.eql('a');
      expect(dts[1].getDOMNode().textContent).to.eql('b');

      var dds = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dd');
      expect(dds[0].getDOMNode().textContent).to.eql('x');
      expect(dds[1].getDOMNode().textContent).to.eql('y');
    });

    it("should sort sort key/value pairs", function () {
      var data = [
        ['b', 'y'], ['a', 'x']
      ];
      var elem = TestUtils.renderIntoDocument(<DefinitionList data={data} />);

      var dts = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dt');
      expect(dts[0].getDOMNode().textContent).to.eql('a');
      expect(dts[1].getDOMNode().textContent).to.eql('b');

      var dds = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dd');
      expect(dds[0].getDOMNode().textContent).to.eql('x');
      expect(dds[1].getDOMNode().textContent).to.eql('y');
    });

    it("should use a single space for values that are an empty string", function () {
      var data = [
        ['b', 'y'], ['a', ''] // empty string
      ];
      var elem = TestUtils.renderIntoDocument(<DefinitionList data={data} />);

      var dts = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dt');
      expect(dts[0].getDOMNode().textContent).to.eql('a');
      expect(dts[1].getDOMNode().textContent).to.eql('b');

      var dds = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dd');
      expect(dds[0].getDOMNode().textContent).to.eql(' ');
      expect(dds[1].getDOMNode().textContent).to.eql('y');
    });

    it("should coerce non-strings into strings", function () {
      var data = [
        ['a', false]
      ];
      var elem = TestUtils.renderIntoDocument(<DefinitionList data={data} />);

      var dts = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dt');
      expect(dts[0].getDOMNode().textContent).to.eql('a');

      var dds = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dd');
      expect(dds[0].getDOMNode().textContent).to.eql('false');
    });

    it("shouldn't blow up on null", function () {
      var data = [
        ['a', null]
      ];
      var elem = TestUtils.renderIntoDocument(<DefinitionList data={data} />);

      var dts = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dt');
      expect(dts[0].getDOMNode().textContent).to.eql('a');

      var dds = TestUtils.scryRenderedDOMComponentsWithTag(elem, 'dd');
      expect(dds[0].getDOMNode().textContent).to.eql('null');
    });
  });
});

