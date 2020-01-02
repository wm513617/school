import UnaryUnionOp from './operation/union/UnaryUnionOp';
import extend from '../../../extend';
import System from '../../../java/lang/System';
import WKTReader from './io/WKTReader';
export default function Test() {}
extend(Test.prototype, {
	interfaces_: function () {
		return [];
	},
	getClass: function () {
		return Test;
	}
});
Test.main = function (args) {
	var reader = new WKTReader();
	var gc = reader.read("GEOMETRYCOLLECTION (LINEARRING (0 0, 0 70, 80 70, 80 0, 0 0), LINESTRING (30 110, 30 30, 100 30))");
	var union = UnaryUnionOp.union(gc);
	System.out.println(union);
};
