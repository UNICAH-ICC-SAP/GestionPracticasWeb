import React from "react";
import { DEF, Props } from "@root/Api/typesProps";

export type PROP = {
    style?: {
        width?: string;
        height?: string;
    }
    src: string;
};

export default function Image(props: Props<PROP, typeof DEF>) {
    return <img src={props.src} style={{ ...props.style }} />
}
