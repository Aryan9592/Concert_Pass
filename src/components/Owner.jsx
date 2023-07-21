import React from "react";

export default function Owner(){

    const [supplyData, setSupplyData] = React.useState(0)

    const handleChange = (event) => {
        setSupplyData(event.target.value)
        // console.log(supplyData)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="supply" id="" placeholder="Write the amount in Wei" onChange={handleChange}/>
            <button type="submit">Set Max Supply</button>
        </form>
        <form action="">
            <input type="text" name="price" id="" placeholder="In Ether"/>
            <button type="submit">Set Price</button>
        </form>
        <button>Withdraw</button>
        </>
    )
}