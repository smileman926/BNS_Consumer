import React, { createRef, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import * as style from "./SixNumeric.module.scss";

function SixNumeric({ handler }) {
  const [value, setValue] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  const refs = {
    0: createRef(),
    1: createRef(),
    2: createRef(),
    3: createRef(),
    4: createRef(),
    5: createRef(),
  };

  const handlePaste = (e) => {
    e.preventDefault(); // pastes one char at a time by default
    let data = e.clipboardData.getData("text");
    let pasted = {};
    data.replace(/\D/g, "").split("").map((chr, i) => {
      if (i < 6){
        value[i] = chr;
        refs[i].current.focus();
      }
      else {
        return;
      }
    });
     setValue({...value, ...pasted,});
  }

  useEffect(() => {
    const code = Object.values(value).join("");
    handler(code);
  });

  const handleDelete = (e) => {
    if (e.keyCode === 8){ // backspace

      const {id} = e.target.dataset;
      setValue({...value, [id]: ""});

      if (id === "0"){
        return;
      }
      refs[Number(id) - 1].current.focus();
    }
  }

  const handlerNumber = ({ target }) => {
    const { id } = target.dataset;
    setValue({
      ...value,
      [id]: target.value.replace(/\D/g, "").replace(value[id], "")[0],
    });


    
    if (id === "5") return;
    if (target.value.length === 0) return;

    refs[Number(id) + 1].current.focus();
  };

  return (
    <div className={style.fourNumber} onPaste={handlePaste}>
      <Form.Control
        type="text"
        className={style.input}
        onChange={handlerNumber}
        onKeyDown={handleDelete}
        value={value[0]}
        data-id="0"
        ref={refs[0]}
        required
      />
      <Form.Control
        type="text"
        className={style.input}
        onChange={handlerNumber}
        onKeyDown={handleDelete}
        value={value[1]}
        data-id="1"
        ref={refs[1]}
        required
      />
      <Form.Control
        type="text"
        className={style.input}
        onChange={handlerNumber}
        onKeyDown={handleDelete}
        value={value[2]}
        data-id="2"
        ref={refs[2]}
        required
      />
      <Form.Control
        type="text"
        className={style.input}
        onChange={handlerNumber}
        onKeyDown={handleDelete}
        value={value[3]}
        data-id="3"
        ref={refs[3]}
        required
      />
      <Form.Control
        type="text"
        className={style.input}
        onChange={handlerNumber}
        onKeyDown={handleDelete}
        value={value[4]}
        data-id="4"
        ref={refs[4]}
        required
      />
      <Form.Control
        type="text"
        className={style.input}
        onChange={handlerNumber}
        onKeyDown={handleDelete}
        value={value[5]}
        data-id="5"
        ref={refs[5]}
        required
      />
    </div>
  );
}

export default SixNumeric;
