'use client'

import { api } from "@/lib/api"
import { Camera, Image } from "lucide-react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { FaRegEnvelope } from "react-icons/fa"
import { IMaskInput } from "react-imask"
import Alert from "./Alert"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { TiDelete } from "react-icons/ti"
import Cookie from 'js-cookie'
import { useRouter } from "next/navigation"

export default function EditPropertyForm(props : { propertyId: string | string[] | undefined, token: string | undefined }) {
    const router = useRouter()

    const [property, setProperty] = useState<any>(null)
    const [previews, setPreviews] = useState<string[]>([])
    
    const [toRemove, setToRemove] = useState<string[]>([])

    
    useEffect(() => {
        const property = handlePropertyForm()
        
        // ?
        property.then((res) => {
            setProperty(res)
        })

    }, [])

    // Cria lista com imagens para remover, atualiza estrutura property
    function handleRemoveImage(imageObj : {imageUrl : string, imageId: string}) {
        const images = property.imageData
        const imageToRemove = imageObj

        const imageData = images.filter((obj : {imageUrl: string}) => obj !== imageToRemove)
        const propertyData = property.propertyData

        const newProperty = {propertyData, imageData}

        setProperty(newProperty)

        const imageToRemoveId = imageToRemove.imageId
        setToRemove((prevToRemove) => [...prevToRemove, imageToRemoveId])
    }

    // Recebe as informacoes do formulario
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

    function validateForm(formData: FormData){
        const name = formData.get('name')
        const cep = formData.get('cep')
        const state = formData.get('state')
        const city = formData.get('city')
        const address = formData.get('address')
        const price = formData.get('price')
        const description = formData.get('description')
        const propertyType = formData.get('property-type')
        const propertyNumber = formData.get('property-number')
        const numBedroom = formData.get('bedrooms')
        const numBathroom = formData.get('bathrooms')

        let valid = true
        if (!name || name.toString().trim().length === 0) {
            toast.error('É necessário adicionar um nome!');
            valid = false
        }
        if (!cep || cep.toString().trim().length === 0) {
            toast.error('É necessário adicionar um CEP!');
            valid = false
        }
        if (!price || price.toString().trim().length === 0) {
            toast.error('É necessário adicionar um preço!');
            valid = false
        }
        if (!propertyNumber || propertyNumber.toString().trim().length === 0) {
            toast.error('É necessário adicionar o número da propriedade!');
            valid = false
        }
        if (!numBedroom || numBedroom.toString().trim().length === 0) {
            toast.error('É necessário adicionar a quantidade de quartos!');
            valid = false
        }
        if (!numBathroom || numBathroom.toString().trim().length === 0) {
            toast.error('É necessário a quantidade de banheiros!');
            valid = false
        }
        if (!description || description.toString().trim().length === 0) {
            toast.error('É necessário adicionar uma descrição!');
            valid = false
        }
        if (!state || state.toString().trim().length === 0) {
            toast.error('É necessário adicionar um CEP!');
            valid = false
        }
        

        if(previews.length + property.imageData.length === 0){
            toast.error('É necessário adicionar uma imagem!')
            valid = false
        }

        return valid
    }

    // Envia a atualizacao de formulario
    async function handleProperty(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const valid = validateForm(formData);
        if(!valid){
            return
        }

        const token = Cookie.get('token')
        
        // Atualizacao da propriedade
        const property = await api.put(`/properties/${props.propertyId}`, {
            name: formData.get('name'),
            cep: formData.get('cep'),
            state: formData.get('state'),
            city: formData.get('city'),
            address: formData.get('address'),
            price: parseFloat(formData.get('price')?.toString() ?? '0'),
            description: formData.get('description'),
            propertyType: formData.get('property-type'),
            propertyNumber: parseInt(formData.get('property-number')?.toString() ?? '0'),
            numBedroom: parseInt(formData.get('bedrooms')?.toString() ?? '0'),
            numBathroom: parseInt(formData.get('bathrooms')?.toString() ?? '0'),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        // Remove as imagens
        if (toRemove.length > 0) {
            await api.delete(`/images`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    ids: toRemove,
                },
            })

        }

        // Upload das novas imagens
        if (previews.length > 0) {
            const filesToUpload = formData.getAll('coverUrl')
        
            if (filesToUpload) {
                const uploadFormData = new FormData()
    
                filesToUpload.forEach(async (file) => {
                    uploadFormData.set('file', file)
                    const uploadResponse = await api.post('/upload', uploadFormData) // Essa rota APENAS suporta multpart form data
                    const imageUrl = uploadResponse.data.fileUrl
                    const imageId = uploadResponse.data.fileId
                    
                    // Linkar imagens com propriedade
                    await api.post('/images', {
                        imageId: imageId,
                        imageUrl:  imageUrl,
                        propertyId: props.propertyId,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
    
                })
            }
        }

        router.push('/my-properties')
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

        if (!files || files.length + property.imageData.length > 5) {
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
                <form onSubmit={handleProperty}>
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
                            {property.imageData.map((preview : {imageUrl: string, imageId: string}, index: number) => ( 
                                                            <div key={index} className="relative">
                                                                <img
                                                                    src={preview.imageUrl}
                                                                    alt={`Preview ${index}`}
                                                                    className='h-[140px] w-[280px] rounded-lg object-cover m-2'
                                                                />
                                                                <span 
                                                                    className="absolute bottom-4 right-4 z-10 text-red-700 hover:text-red-500 hover:cursor-pointer"
                                                                    onClick={() => handleRemoveImage(preview)}
                                                                >
                                                                    <TiDelete className='w-8 h-8' />
                                                                </span>
                                                            </div>
                            ))}
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