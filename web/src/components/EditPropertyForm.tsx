'use client'

import { api } from "@/lib/api"
import { Camera, Image } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"
import { FaRegEnvelope } from "react-icons/fa"
import { IMaskInput } from "react-imask"
import Alert from "./Alert"
import axios from "axios"
import { ToastContainer } from "react-toastify"

export default function EditPropertyForm(props : { propertyId: string | string[] | undefined, token: string | undefined }) {

    const [property, setProperty] = useState<any>(null)
    const [previews, setPreviews] = useState<string[]>([])

    useEffect(() => {
        const property = handlePropertyForm()

        // ?
        property.then((res) => {
            setProperty(res)

            const previewsObj = res.imageData
            const previews = previewsObj.map((preview: { imageUrl: string })  => preview.imageUrl)

            setPreviews(previews)
        })

    }, [])

    async function handlePropertyForm() {
        const propertyResponse = await api.get(`/properties/${props.propertyId}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        const propertyData = propertyResponse.data
        
        const imageResponse = await api.get(`/images/${props.propertyId}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        const imageData = imageResponse.data
        
        const property = { propertyData, imageData }

        return property
    }

    async function pickUpCEP(event: ChangeEvent<HTMLInputElement>) {
        const cep = event.target.value
        
        const stateInput = document.querySelector<HTMLInputElement>('input[name="state"]')!
        const cityInput = document.querySelector<HTMLInputElement>('input[name="city"]')!
        const streetInput = document.querySelector<HTMLInputElement>('input[name="address"]')!

        if (!cep) {
            Alert('Adicione um CEP!')
            stateInput.value = ''
            cityInput.value = ''
            streetInput.value = ''
            return
        }

        try {
            const response = await axios.get(`http://viacep.com.br/ws/${cep}/json/`)
            if (response.data.erro) {
                stateInput.value = ''
                cityInput.value = ''
                streetInput.value = ''
                Alert('CEP inválido!')
            } else {
                stateInput.value = response.data.uf
                cityInput.value = response.data.localidade
                streetInput.value = response.data.logradouro
            }
        } catch (erro) {
            stateInput.value = ''
            cityInput.value = ''
            streetInput.value = ''
            Alert('Erro ao obter informações do CEP.')
        }
    }

    function onImageSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target

        if (!files || files.length > 5) {
            return
        }

        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));

        setPreviews((prevPreviews) => [...newPreviews])
    }

    return(
        <>
            <ToastContainer /> 
            {
            !property ? (
                <p>Carregando...</p> 
            ) : ( 
                <form>
                    <div className='flex items-center mb-4'>
                        <h1 className='text-2xl font-bold'>Editar propriedade</h1>
                    </div>

                    <div className='flex'>               
                        {/** Esq */}
                        <div className="flex"> 
                            <div>
                                <label htmlFor="name" className="text-sm text-gray-600 mb-1 ml-2">Nome do anúncio</label>
                                <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        placeholder="Nome" 
                                        className="bg-white outline-none text-sm flex-1"
                                        defaultValue={property.propertyData.name}
                                    ></input>
                                </div>

                                <label htmlFor="cep" className="text-sm text-gray-600 mb-1 ml-2">CEP do imóvel</label>
                                <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <IMaskInput
                                        mask="00000-000"
                                        placeholder="CEP"
                                        className="bg-white outline-none text-sm flex-1"
                                        name="cep"
                                        id="cep"
                                        defaultValue={property.propertyData.zipcode}
                                        onBlur={pickUpCEP}
                                    />
                                </div>

                                <label className="text-sm text-gray-600 mb-1 ml-2">Estado</label>
                                <div className="bg-gray-50 w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input 
                                        type="text" 
                                        name="state" 
                                        placeholder="Estado" 
                                        readOnly 
                                        className="bg-gray-50 outline-none text-sm flex-1 text-gray-400 cursor-not-allowed" 
                                        tabIndex={-1}
                                        defaultValue={property.propertyData.state}    
                                    ></input>
                                </div>

                                <label className="text-sm text-gray-600 mb-1 ml-2">Cidade</label>
                                <div className="bg-gray-50 w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input 
                                        type="text" 
                                        name="city" 
                                        placeholder="Cidade" 
                                        readOnly 
                                        className="bg-gray-50 outline-none text-sm flex-1 text-gray-400 cursor-not-allowed" 
                                        tabIndex={-1}
                                        defaultValue={property.propertyData.city}    
                                    ></input>
                                </div>

                                <label className="text-sm text-gray-600 mb-1 ml-2">Endereço</label>
                                <div className="bg-gray-50 w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input 
                                        type="text" 
                                        name="address" 
                                        placeholder="Rua" 
                                        readOnly 
                                        className="bg-gray-50 outline-none text-sm flex-1 text-gray-400 cursor-not-allowed" 
                                        tabIndex={-1}
                                        defaultValue={property.propertyData.address}
                                    ></input>
                                </div>

                                <label htmlFor="price" className="text-sm text-gray-600 mb-1 ml-2">Valor</label>
                                <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <IMaskInput
                                        mask={Number}
                                        radix="."
                                        lazy={false}
                                        unmask={true}
                                        inputMode="numeric"
                                        pattern="R$ num"
                                        name="price"
                                        id="price"
                                        placeholder="R$ 0,00"
                                        className="bg-white outline-none text-sm flex-1"
                                        defaultValue={property.propertyData.price}
                                    />
                                </div>

                                <label htmlFor="description" className="text-sm text-gray-600 mb-1 ml-2">Descrição do anúncio</label>
                                <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                                    <textarea 
                                        name="description"
                                        id="description"
                                        spellCheck={false}
                                        placeholder="Descrição" 
                                        className="bg-white outline-none text-sm flex-1 resize-none leading-relaxed"
                                        defaultValue={property.propertyData.description}   
                                    ></textarea>
                                </div>
                            </div>
                            <div className="ml-3">
                                <label htmlFor="property-type" className="text-sm text-gray-600 mb-1 ml-2">Tipo do imóvel</label>
                                <div className="bg-white w-52 p-2 flex items-center mb-3 rounded-xl">
                                    <select 
                                        name="property-type" 
                                        id="property-type"  
                                        className="bg-white outline-none text-sm flex-1"
                                        defaultValue={property.propertyData.propertyType}    
                                    >
                                        <option value="house">Casa</option>
                                        <option value="apartment">Apartamento</option>
                                    </select>
                                </div>

                                <label htmlFor="property-number" className="text-sm text-gray-600 mb-1 ml-2">Número</label>
                                <div className="bg-white w-52 p-2 flex items-center mb-3 rounded-xl">
                                    <IMaskInput
                                        mask="000000"
                                        name="property-number"
                                        id="property-number"
                                        placeholder="Número do imóvel"
                                        className="bg-white outline-none text-sm flex-1"
                                        defaultValue={property.propertyData.propertyNumber}
                                    />
                                </div>

                                <label className="text-sm text-gray-600 mb-1 ml-2">Quantidade de quartos</label>
                                <div className="flex mb-2 py-2 ">
                                    <label className="bg-white w-1/3 flex items-center justify-center rounded-full">
                                        <input type="radio" name="bedrooms" value="1" id="q1" />
                                        <span>1</span>
                                    </label>
                                    <label className="bg-white w-1/3 flex items-center justify-center rounded-full ml-3 mr-3">
                                        <input type="radio" name="bedrooms" value="2" id="q2" />
                                        <span>2</span>
                                    </label>
                                    <label className="bg-white w-1/3 flex items-center justify-center rounded-full">
                                        <input type="radio" name="bedrooms" value="3" id="q3" />
                                        <span>3+</span>
                                    </label>
                                </div>

                                <label className="text-sm text-gray-600 mb-1 ml-2">Quantidade de banheiros</label>
                                <div className="flex mb-2 py-2 ">
                                    <label className="bg-white w-1/3 flex items-center justify-center rounded-full">
                                        <input type="radio" name="bathrooms" value="1" id="b1"/>
                                        <span>1</span>
                                    </label>
                                    <label className="bg-white w-1/3 flex items-center justify-center rounded-full ml-3 mr-3">
                                        <input type="radio" name="bathrooms" value="2" id="b2" />
                                        <span>2</span>
                                    </label>
                                    <label className="bg-white w-1/3 flex items-center justify-center rounded-full">
                                        <input type="radio" name="bathrooms" value="3" id="b3" />
                                        <span>3+</span>
                                    </label>
                                </div>

                            </div>
                        </div>

                        {/** Dir - preview */}
                        <div className='w-full'>
                            <div className='flex items-center gap-4'>
                                <label htmlFor='media' className='flex w-full justify-center cursor-pointer items-center gap-1.5 text-sm text-black hover:text-green-700'>
                                    <Camera className='w-4 h-4' />
                                    Adicionar imagem
                                </label>
                                <input
                                    onChange={onImageSelected}
                                    name='coverUrl'
                                    type='file' 
                                    id='media'
                                    accept='image/*'
                                    className='invisible h-0 w-0' 
                                    multiple
                                />  
                            </div>
                            <div className='flex flex-wrap justify-center'>
                            {previews.map((preview, index) => ( <img
                                                            key={index}
                                                            src={preview}
                                                            alt={`Preview ${index}`}
                                                            className='h-[140px] w-[280px] rounded-lg object-cover m-2'
                                                            />
                            ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit"
                            className="border-2 border-white rounded-full px-8 py-2 inline-block font-semibold hover:bg-white mb-4">
                        Atualizar
                    </button>
                </form>
            )}
        </>
    )
}