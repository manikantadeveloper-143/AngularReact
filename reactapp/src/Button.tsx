import React from "react";

const Button = () => {



const clickHandler=()=>{
  alert('BUtton Cliked from Remote Application and sending to host Application')
}

  return (
  
    <>
      <div>
        <p>This is a button component from MFE1</p>
      </div>
      <button onClick={clickHandler}>MFE1 Button</button>
    </>
  );
}

export default Button;
