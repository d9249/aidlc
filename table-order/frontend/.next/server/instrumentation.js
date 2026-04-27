"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "instrumentation";
exports.ids = ["instrumentation"];
exports.modules = {

/***/ "(instrument)/./src/instrumentation.ts":
/*!********************************!*\
  !*** ./src/instrumentation.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   register: () => (/* binding */ register)\n/* harmony export */ });\n// Node.js v25+ exposes a broken localStorage global (getItem is undefined).\n// Delete it so server-side code doesn't accidentally use it.\nif ( true && typeof localStorage !== \"undefined\") {\n    delete globalThis.localStorage;\n}\nfunction register() {\n// intentionally empty — side-effect import above is sufficient\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGluc3RydW1lbnQpLy4vc3JjL2luc3RydW1lbnRhdGlvbi50cyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEsNEVBQTRFO0FBQzVFLDZEQUE2RDtBQUM3RCxJQUFJLEtBQTZCLElBQUksT0FBT0EsaUJBQWlCLGFBQWE7SUFDeEUsT0FBTyxXQUF3Q0EsWUFBWTtBQUM3RDtBQUVPLFNBQVNFO0FBQ2QsK0RBQStEO0FBQ2pFIiwic291cmNlcyI6WyIvVXNlcnMvbWVhbi9Eb2N1bWVudHMvR2l0aHViL2FpZGxjL2FpZGxjLXdvcmtmbG93cy90YWJsZS1vcmRlci9mcm9udGVuZC9zcmMvaW5zdHJ1bWVudGF0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE5vZGUuanMgdjI1KyBleHBvc2VzIGEgYnJva2VuIGxvY2FsU3RvcmFnZSBnbG9iYWwgKGdldEl0ZW0gaXMgdW5kZWZpbmVkKS5cbi8vIERlbGV0ZSBpdCBzbyBzZXJ2ZXItc2lkZSBjb2RlIGRvZXNuJ3QgYWNjaWRlbnRhbGx5IHVzZSBpdC5cbmlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgZGVsZXRlIChnbG9iYWxUaGlzIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KS5sb2NhbFN0b3JhZ2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcigpIHtcbiAgLy8gaW50ZW50aW9uYWxseSBlbXB0eSDigJQgc2lkZS1lZmZlY3QgaW1wb3J0IGFib3ZlIGlzIHN1ZmZpY2llbnRcbn1cbiJdLCJuYW1lcyI6WyJsb2NhbFN0b3JhZ2UiLCJnbG9iYWxUaGlzIiwicmVnaXN0ZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(instrument)/./src/instrumentation.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(instrument)/./src/instrumentation.ts"));
module.exports = __webpack_exports__;

})();