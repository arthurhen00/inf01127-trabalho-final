export default function ShowProfileInfo(props : {user : User | undefined, city : any}) {
    const user = props.user
    const city = props.city

    return (
        <div className="flex flex-col">
            <div>
              <span className="text-base font-bold">Nome: </span>
              <span>{user?.name}</span>
            </div>

            <div>
              <span className="text-base font-bold">Email: </span>
              <span>{user?.email}</span>
            </div>

            <div>
              <span className="text-base font-bold">CPF: </span>
              <span>{user?.cpf}</span>
            </div>
            
            <div>
              <span className="text-base font-bold">Cidade: </span>
              <span>{user?.cpf}</span>
            </div>
        </div>
    )
}
