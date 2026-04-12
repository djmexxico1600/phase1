const React = require('react');

function createShim(name) {
  return function Shim(props) {
    const { children } = props;
    return React.createElement('div', { 'data-radix-shim': name }, children || null);
  };
}

exports.Sheet = createShim('Sheet');
exports.SheetTrigger = createShim('SheetTrigger');
exports.SheetContent = createShim('SheetContent');
exports.SheetClose = createShim('SheetClose');
exports.SheetHeader = createShim('SheetHeader');
exports.SheetTitle = createShim('SheetTitle');
exports.SheetDescription = createShim('SheetDescription');

module.exports = exports;
