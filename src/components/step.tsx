import { ReactNode } from "react";

export const Step = ({ title, description, content }: { title: string, description: string, content: ReactNode }) => {
    return <>
        <h2>
            <b>
                {title}
            </b>
        </h2>
        <p>
            {description}
        </p>
        <hr />
        {content}
    </>
};