export default function EditButton(props) {
    function boldCommand() {
        const strongElement = document.createElement("strong");
        const userSelection = window.getSelection();
        const selectedTextRange = userSelection.getRangeAt(0);
        selectedTextRange.surroundContents(strongElement);
    }

    function selectedStyles(props, tag = "span", href = false, styles = false) {
        function replaceSelected() {
            let range = window.getSelection();

            let documentFragment = range.getRangeAt(0).extractContents();
            let b = document.createElement(tag);

            if (href !== false) {
                b.setAttribute("href", href);
            }
            if (styles !== false) {
                b.setAttribute("style", styles);
            }

            b.appendChild(documentFragment);
            range.getRangeAt(0).insertNode(b);
           // window.navigator.clipboard.writeText(b.innerHTML)
        }
        if (props.selectedtext) {
            return replaceSelected();
        }
    }

    return (
        <button
            className="bg-white m-1 cursor-pointer hover:bg-gray-200"
            key={props.cmd}
            onMouseDown={evt => {
                evt.preventDefault(); // Avoids loosing focus from the editable area
            let clear =  props.sanitizeHtml(props.selectedtext,{ transformTags: {
                      'div': 'h1',
                  }})

                console.log(clear)
              //  document.getSelection().focusNode.parentElement.classList.toggle('bold')
              //  boldCommand()
               // selectedStyles(props, "b")
               // document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
            }}
        >
            {props.name === 'i'?<Italic/>:props.name === 'h1'?<H1/>:props.name === 'b'?<Bold/>:props.name}
        </button>
    );

    function Italic(){
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-italic" viewBox="0 0 16 16">
                <path
                    d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
            </svg>
        </>
    }

    function Bold(){
        return <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                 className="bi bi-type-italic" viewBox="0 0 16 16">
                <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
            </svg>
        </>
    }

    function H1(){
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                    className="bi bi-type-h1" viewBox="0 0 16 16">
            <path
                d="M7.648 13V3H6.3v4.234H1.348V3H0v10h1.348V8.421H6.3V13zM14 13V3h-1.333l-2.381 1.766V6.12L12.6 4.443h.066V13z"/>
        </svg>
    }


}