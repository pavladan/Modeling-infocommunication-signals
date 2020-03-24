import React from 'react'
import {MathFieldComponent} from 'react-mathlive'
export default function FunctionMode() {
	return (
		<div>
			<MathFieldComponent
          latex="f\mleft(t\mright)=\begin{cases}A,t\ge \tau  \\ 0,t<\tau \end{cases}"
          onChange={e=>console.log(e)}
          mathFieldRef={mf => console.log(mf)}
          mathFieldConfig={{
            defaultMode: "math",
            virtualKeyboardMode: "onfocus",
            ignoreSpacebarInMathMode: false,
          }}
        />
		</div>
	)
}
