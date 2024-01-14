export default function ShowSoldProperties(props : {data : NegotiatedProperty[]}) {
    const data = props.data

    if (data.length === 0) {
        return (
            <span>Nenhuma propriedade vendida.</span>
        )
    }

    return (
        <div>
            { data.map((property : NegotiatedProperty, index : number) => {
                return (
                    <div key={index} className="flex py-4">
                        <img
                            src={property.propertyData.images[0].imageUrl}
                            alt=''
                            className='h-[120px] w-[240px] rounded-lg object-cover'
                        />
                        <div className="flex flex-col ml-2">
                            <span>Nome: {property.propertyData.name}</span>
                            <span>Valor pago: {'R$ ' + property.contractData.price}</span>
                            <span>Comprador: {'email do cara'}</span>
                            <a href="" className="hover:underline hover:cursor-pointer">Ver contrato</a>
                        </div>
                    </div>
                )
            }) }
        </div>
    )
}
