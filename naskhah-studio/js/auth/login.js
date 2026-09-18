/* Naskhah Studio auth compatibility module.
 * Authentication form ownership lives in js/core/bootstrap.js.
 * This file intentionally does not bind duplicate submit handlers.
 */
(()=>{
  'use strict';
  Object.defineProperty(window,'NaskhahLoginCompatibilityModule',{
    value:Object.freeze({version:'3.2.0-bootstrap-owned'}),
    writable:false,
    configurable:false,
    enumerable:true
  });
})();