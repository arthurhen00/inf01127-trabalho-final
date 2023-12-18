'use client';

import { useRouter } from "next/navigation"
import { Camera } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaRegEnvelope } from 'react-icons/fa';
import {toast} from 'react-toastify'
import Cookie from 'js-cookie'
import { api } from '@/lib/api';
import { IMaskInput } from "react-imask";


export default function AddPropertyForm () {
    const router = useRouter()

    const [previews, setPreviews] = useState<string[]>([]);

    function validateForm(formData: FormData){
        const name = formData.get('name')
        const address = formData.get('address')
        const cep = formData.get('cep')
        const description = formData.get('description')

        console.log('name:' + name)
        console.log('address:' + address)
        console.log('cep:' + cep)
        console.log('description:' + description)

        let valid = true
        if (!name || name.toString().trim().length === 0) {
            toast.error('É necessário adicionar um nome!');
            valid = false
        }
        if (!address || address.toString().trim().length === 0) {
            toast.error('É necessário adicionar um endereço!');
            valid = false
        }
        if (!cep || cep.toString().trim().length === 0) {
            toast.error('É necessário adicionar um CEP!');
            valid = false
        }
        if (!description || description.toString().trim().length === 0) {
            toast.error('É necessário adicionar uma descrição!');
            valid = false
        }

        if(previews.length === 0){
            toast.error('É necessário adicionar uma imagem!')
            valid = false
        }

        return valid
    }

    async function handleProperty(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        const formData = new FormData(event.currentTarget)

        const valid = validateForm(formData);
        if(!valid){
            return
        }
        // Registro da propriedade
        const token = Cookie.get('token')

        const property = await api.post('/properties', {
            name: formData.get('name'),
            cep: formData.get('cep'),
            description: formData.get('description'),
            address: formData.get('address'),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const propertyId = property.data.id

        // Upload dos arquivos
        const filesToUpload = formData.getAll('coverUrl')
        
        if (filesToUpload) {
            const uploadFormData = new FormData()

            filesToUpload.forEach(async (file) => {
                uploadFormData.set('file', file)
                const uploadResponse = await api.post('/upload', uploadFormData) // Essa rota APENAS suporta multpart form data
                const imageUrl = uploadResponse.data.fileUrl
                
                // Linkar imagens com propriedade
                await api.post('/images', {
                    imageUrl:  imageUrl,
                    propertyId: propertyId,
                })

            })
        }

        router.push('/home')

        
    }

    

    function onImageSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target


        if (!files || files.length > 5) {
            return
        }

        const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));

        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }

    return  (
        <form onSubmit={handleProperty} id='property-form'>
            <div className='flex items-center'>
                <h1 className=''>Adicionar propriedade</h1>
            </div>

            <div className='flex'>               
                {/** Esq */}
                <div> 
                    <div>
                        <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                            <FaRegEnvelope className="text-gray-400 mr-2" />
                            <input type="name" name="name" placeholder="Nome" className="bg-white outline-none text-sm flex-1"></input>
                        </div>
                        <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                            <FaRegEnvelope className="text-gray-400 mr-2" />
                            <IMaskInput
                                mask="00000-000"
                                placeholder="CEP"
                                className="bg-white outline-none text-sm flex-1"
                                name="cep"
                            />
                        </div>
                        <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                            <FaRegEnvelope className="text-gray-400 mr-2" />
                            <input type="address" name="address" placeholder="Endereço" className="bg-white outline-none text-sm flex-1"></input>
                        </div>
                        <div className="bg-white w-64 p-2 flex items-center mb-3 rounded-xl">
                            <textarea 
                                name="description"
                                spellCheck={false}
                                placeholder="Descrição" 
                                className="bg-white outline-none text-sm flex-1 resize-none leading-relaxed">
                            </textarea>
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
                                                        )
                                    )
                        }
                    </div>
                </div>
            </div>

            <button type="submit"
                    className="border-2 border-white rounded-full px-8 py-2 inline-block font-semibold hover:bg-white">
                Enviar
            </button>
        </form>
    )
}