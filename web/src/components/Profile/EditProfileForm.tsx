import { api } from "@/lib/api"
import { FormEvent, useState } from "react"
import Cookie from 'js-cookie'
import Alert from "../Alert"
import Success from "../Success"

export default function EditProfileForm(props : {user : User | undefined, city : string[]}) {
    const user = props.user
    const city = props.city

    const [options, setOptions] = useState<string[]>(city)
    const [select, setSelect] = useState('')

    const handleInputChange = (e : any) => {
        const filtro = e.target.value.toLowerCase();
        const opcoesFiltradas = city.filter(opcao =>
          opcao.toLowerCase().includes(filtro)
        );
    
        setOptions(opcoesFiltradas);
        setSelect(filtro);
    }

    async function handleProfile (event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const name = formData.get('name') as string | null
        const email = formData.get('email') as string | null
        const city = formData.get('city') as string | null

        if (name?.length === 0) {
            Alert('É necessário adicionar um nome!')
            return
        }

        console.log(name, email, city)

        const token = Cookie.get('token')
        const newUser = await api.put(`/user/${user?.id}`, {
            name: formData.get('name'),
            email: formData.get('email'),
            city: formData.get('city'),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        Success('Perfil alterado!')
    }

    return (
        <form onSubmit={handleProfile}>
            <div className="flex flex-col">
                <label htmlFor="name" className="text-sm text-gray-600 ml-2">Nome</label>
                <div className="bg-white w-64 p-2 flex items-center rounded-xl mb-2">
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder="Nome" 
                        className="bg-white outline-none text-sm flex-1"
                        defaultValue={user?.name}
                    ></input>
                </div>

                <label htmlFor="email" className="text-sm text-gray-600 ml-2">Email</label>
                <div className="bg-white w-64 p-2 flex items-center rounded-xl mb-2">
                    <input 
                        type="text" 
                        name="email" 
                        id="email" 
                        placeholder="Nome" 
                        className="bg-white outline-none text-sm flex-1"
                        defaultValue={user?.email}
                        ></input>
                </div>

                <label className="text-sm text-gray-600 mb-1 ml-2">CPF</label>
                <div className="bg-gray-50 w-64 p-2 flex items-center mb-3 rounded-xl">
                    <input 
                        type="text" 
                        name="cpf" 
                        placeholder="CPF" 
                        readOnly 
                        className="bg-gray-50 outline-none text-sm flex-1 text-gray-400 cursor-not-allowed" 
                        tabIndex={-1}
                        defaultValue={user?.cpf}
                        ></input>
                </div>
                
                <label htmlFor="email" className="text-sm text-gray-600 ml-2">Cidade</label>
                <div className="bg-white w-64 p-2 rounded-xl mb-2 flex flex-col">
                    <input
                        type="text"
                        value={select}
                        onChange={handleInputChange}
                        placeholder="Digite para filtrar"
                        className="bg-white outline-none text-sm flex-1 ml-1"
                        />
                    <select 
                        value={select} 
                        onChange={(e) => setSelect(e.target.value)}
                        name="city"
                        className="bg-white outline-none"
                        >
                        {options.map((opcao, index) => (
                            <option  key={index} value={opcao}>
                            {opcao}
                        </option>
                        ))}
                    </select>
                </div>
            </div>
            <button type="submit"
                    className="border-2 border-white rounded-full px-8 py-2 inline-block font-semibold hover:bg-white mb-2">
                Atualizar perfil
            </button>
        </form>
    )
}
