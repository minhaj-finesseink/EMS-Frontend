import { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";

function Test() {
  const mathFieldRef = useRef();

  useEffect(() => {
    if (!customElements.get("math-field")) {
      customElements.define("math-field", MathfieldElement);
    }
  }, []);

  return (
    <div>
      <math-field
        ref={mathFieldRef}
        virtualKeyboardMode="manual"
        style={{ width: "100%", minHeight: "50px" }}
      ></math-field>
    </div>
  );
}

export default Test;
