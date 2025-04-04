import { MouseEventHandler } from "react"
import "./Modal.scss"

type ModalProps = {
isOpen : boolean,
onClose: MouseEventHandler
children: React.ReactNode
}

const Modal = ({isOpen,onClose,children}:ModalProps) =>{
    console.log(isOpen, onClose, children)
if(!isOpen){
    return null;
}
    return(
    <div className="modal__overlay" onClick={onClose}>
    <div className="modal__content" onClick={(e) => {e.stopPropagation()}}>
        <button className="modal__close-btn"> Закрыть</button>
        {children}
    </div>
    </div>
)
}

export default Modal