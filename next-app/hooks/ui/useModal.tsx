/**
 * サイト全体で利用する汎用モーダル
 */
import React, { useState, ReactNode, VFC } from 'react'
import styles from './useModal.module.scss'
import Portal from '../../lib/react_dom/Portal'

interface ModalState {
  isModalActive: boolean // モーダル開閉状態
  src: string | null // <iframe>でコンテンツを表示したい場合にurlを渡す
}

interface ModalDialogProps {
  children: ReactNode
}

const initialState: ModalState = {
  isModalActive: false,
  src: null,
}

const useModal = () => {
  const [modalValues, setModalValues] = useState(initialState)

  const open = (src?: string) => setModalValues({ src: src ?? null, isModalActive:true })
  const close = () => setModalValues(initialState)

  const ModalDialog:VFC<ModalDialogProps> = ({ children }) => {
    if (!modalValues.isModalActive) return <></>  
    return (
      <Portal>
        <>
          <div className={`${styles.modalWrap} ${modalValues.isModalActive ? styles.modalOpen : undefined}`}>
            <span className={styles.closeBtn} onClick={() => setModalValues(initialState)}>
              ×
            </span>
            <div className={styles.modalInner}>
              {modalValues.src && modalValues.src.length > 0 && <iframe className={styles.iframe} src={modalValues.src} />}
              {children && <div>{children}</div>}
            </div>
          </div>
          <div className={styles.modalBack} onClick={() => setModalValues(initialState)}></div>
        </>
      </Portal>
    )
  }
  return {
    modalValues,
    open,
    close,
    ModalDialog
  }
}
 
 export default useModal