import React from "react";

export default function Owner(){
    return(
        <>
        <form action="">
            <input type="number" name="supply" id="" placeholder="Write the amount in Wei"/>
            <button type="submit">Set Max Supply</button>
        </form>
        <form action="">
            <input type="number" name="price" id="" placeholder="In Ether"/>
            <button type="submit">Set Price</button>
        </form>
        <button>Withdraw</button>
        </>
    )
}