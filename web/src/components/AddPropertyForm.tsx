'use client';


import axios from 'axios';
import React, {useState} from 'react';

export interface InputValues {
    Nome: string;
    CEP: number | undefined;
    Endereço : string;
    Descrição: string;
  }

const AddPropertyForm = () => {
    
	const [inputValues, setInputValues] = useState<InputValues>({
        Nome: '',
        CEP: undefined,
        Endereço: '',
        Descrição: '',

      });
    
    const handleChange = (fieldName: keyof InputValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [fieldName]: value,
        }));
      };

      const getAuthToken = () => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');

        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');

            if (cookieName === 'token') {
                return decodeURIComponent(cookieValue);
            }
        }
      }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const authToken = getAuthToken();

        if (!authToken){
            alert('Usuário não autenticado')
            return
        }

        axios.post(
            `${window.location.protocol}//${window.location.hostname}:6900/properties`,
            JSON.stringify(inputValues),
            {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`
                },
            })
        console.log(JSON.stringify(inputValues))
    };

    return  (
        <>
            <div className='w-full h-full flex justify-center items-center '>
                <form className=' w-4/12 content-center bg-slate-500 mt-10 px-20 py-10 rounded-lg flex flex-col items-center' onSubmit={handleSubmit}>
                    <h1 className='text-2xl self-center mb-10'>Adicionar propriedade</h1>

                    {['Nome', 'CEP', 'Endereço', 'Descrição'].map((fieldName) => (
                        <label  placeholder=' ' key={fieldName} className='self-start w-full flex mb-3'>
                        {fieldName}:
                        <input
                            type="text"
                            value={inputValues[fieldName as keyof InputValues]}
                            onChange={handleChange(fieldName as keyof InputValues)}
                            className='rounded-lg border border-black ml-auto'
                        />
                        </label>
                    ))}

                    <button type='submit' value='submit' className='bg-white px-6 py-1 rounded-lg'> Enviar</button>
                </form>
            </div>
        </>
       
        
        )

};


export default AddPropertyForm;