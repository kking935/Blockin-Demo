import { ReactNode, useState } from "react";
import { DropdownIcon, InfoIcon } from "./icons";

export const Expandable = ({ special, title, content }: { special?: boolean, title: string, content: ReactNode }) => {
    const [visible, setVisible] = useState(false);

    return <div className="expandable">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>
                {title}
            </b>

            <button className={visible ? 'dropdown pullup': 'dropdown'} onClick={() => setVisible(!visible)}>
                {special ? <InfoIcon /> : <DropdownIcon />}
            </button>
        </div>
        <div>
            {visible && content}
        </div>
    </div>
}