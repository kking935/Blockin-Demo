import { ReactNode, useState } from "react";

export const Expandable = ({ title, content }: { title: string, content: ReactNode }) => {
    const [visible, setVisible] = useState(false);

    return <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>
                {title}
            </b>

            <button onClick={() => setVisible(!visible)}>
                {visible ? 'Hide' : 'Show'}
            </button>
        </div>
        <div>
            {visible && content}
        </div>
        <hr />
    </>
}