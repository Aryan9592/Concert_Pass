import React from "react";

export default function Owner({contract, loadData}){

    const [formData, setFormData] = React.useState({
        supply: 0,
        price: 0
    })

    const handleChange = (event) => {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    const handleSupplyChange = async (event) => {
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

    const handlePriceChange = async (event) => {
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
            <button onClick={handleSupplyChange}>Set Max Supply</button>
            <input type="number" name="price" id="" placeholder="In Gwei" onChange={handleChange} value={formData.price}/>
            <button onClick={handlePriceChange}>Set Price</button>
        </form>
        </>
    )
}