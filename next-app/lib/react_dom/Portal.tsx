/**
 * #root直下にDOMを追加したい場合に利用するreact-domのcreatePortal
 * モーダル等での利用を想定
 */
 import { createPortal } from 'react-dom'

 const Portal = ({ children }: any) => {
   const rootElm = typeof window === 'undefined' ? null : document.querySelector('#__next') 
   return rootElm ? createPortal(children, rootElm) : null
 }
 
 export default Portal
 