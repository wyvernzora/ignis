/**
 * util/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
import ErrorIs      from './error-is';
import Expressify   from './expressify';
import Unpromisify  from './unpromisify';
import * as Symbols from './symbols';

/*!
 * Ignis extension.
 */
export default function util(ignis) {
  ignis.util = Object.create(null);
  ignis.util.symbols     = Symbols;
  ignis.util.errorIs     = ErrorIs;
  ignis.util.expressify  = Expressify;
  ignis.util.unpromisify = Unpromisify;
}
