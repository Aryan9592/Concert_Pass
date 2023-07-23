import React from "react";

/* 
    THIS COMPONENT IS ONLY ACCESSIBLE FOR THE OWNER OF THAT PARTICULAR CONTRACT
*/

export default function Owner({contract, loadData}){

    // useStates
    const [formData, setFormData] = React.useState({
        supply: 0,
        price: 0
    })

    // Handles the change effect 
    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    // Sets the new `TokenSupply()` value
    const handleSupplySubmit = async (event) => {
        event.preventDefault()
        const maxSupply = parseInt(formData.supply)
        if (maxSupply > 0){
            try{
                const supply = await contract.setMaxSupply(maxSupply)
                await supply.wait()
                loadData()
            }
            catch(error){
                console.log(error)
            }
        } else {
            console.log("The value must be an int")
        }
    }

    // Sets new 'TokenPrice'
    const handlePriceSubmit = async (event) => {
        event.preventDefault()
        const tokenPrice = parseInt(formData.price)
        if (tokenPrice > 0){
            try{
                const price = await contract.setTokenPrice(tokenPrice)
                await price.wait()
                loadData()
            }
            catch (error) {
                console.log(error)
            }
        } else {
            console.log("The value must be an int")
        }
        
    }

    return(
        <>
        <form>
            <input type="number" name="supply" id="" placeholder="In ether" onChange={handleChange} value={formData.supply}/>
            <button onClick={handleSupplySubmit}>Set Max Supply</button>
            <input type="number" name="price" id="" placeholder="In Gwei" onChange={handleChange} value={formData.price}/>
            <button onClick={handlePriceSubmit}>Set Price</button>
        </form>
        </>
    )
}