import React from "react";
import Logo from "../images/logo.jpg"

export default function Header(){
    return(
        <header>
            <img src={Logo} alt="" width={40}/>
            <button>Connect</button>
        </header>
    )
}