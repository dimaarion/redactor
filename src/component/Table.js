import {arrayCount} from "../action";

export default function Table(props) {
    console.log(props)
    return <div className={`grid grid-cols-${props.col}`}>{props.children}</div>
}