import React from "react";
import { MathFieldComponent } from "react-mathlive";
export default function FunctionMode() {
  console.log(eval("1+2.2"));
  return (
    <div>
      <div style={{ display: "flex" }}>
        <MathFieldComponent
          latex="f\mleft(t\mright)="
          mathFieldConfig={{
            readOnly: true
          }}
        />
        <MathFieldComponent
          latex="\begin{cases}A,t\ge \tau  \\ 0,t<\tau \end{cases}"
          onChange={e => console.log(e)}
          mathFieldRef={mf => console.log(mf)}
          mathFieldConfig={{
            defaultMode: "math",
            virtualKeyboardMode: "onfocus",
            ignoreSpacebarInMathMode: false
          }}
        />
      </div>
    </div>
  );
}
