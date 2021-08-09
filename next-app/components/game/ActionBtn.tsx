import React from "react";

interface Props {
    text: string
}

const actionBtn:React.FC<Props> = ({ text }) => <div>{text}</div>

export default actionBtn