import {arrayCount} from "../action";

export default function Table(props) {
    return <div className={"flex justify-center text-sm lg:text-lg p-4 Z-30"}><div className={`grid grid-cols-${props.col}`}>{props.children}</div></div>
}