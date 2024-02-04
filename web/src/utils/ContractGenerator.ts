import dayjs from 'dayjs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface NegotiatedProperty {
    propertyData: PropertyWithImages
    matchData: MatchRequest
    contractData: Contract
    sellerData: User
}

abstract class ContractGenerator {
    protected template: NegotiatedProperty[];

    constructor(template : NegotiatedProperty[]) {
        this.template = template;
    }

    abstract GeneratePDF() : void 
}

export class SalesReport extends ContractGenerator{
    GeneratePDF(): void {
        const doc = new jsPDF()

        doc.text('Relatório de Compra', 10, 10);

        let body : any = []
        for (const item of this.template) {
            const rowData = [item.sellerData.email,
                             item.propertyData.name,
                             dayjs(item.propertyData.createdAt).format('D[/]MM[/]YY'),
                             'R$ ' + item.propertyData.price, 
                             dayjs(item.propertyData.createdAt).format('D[/]MM[/]YY'),
                             'R$ ' + item.contractData.price,
                            ]
            body.push(rowData)
        }

        console.log(body)
        
        autoTable(doc, {
            head: [['Comprador',
                    'Anúncio', 
                    'Data de criação', 
                    'Valor do anúncio',
                    'Data de venda',
                    'Valor acordado',
                ]],
            body: body,
        })

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    }

}

export class PurchaseReport extends ContractGenerator{
    GeneratePDF(): void {
        const doc = new jsPDF()

        doc.text('Relatório de Vendas', 10, 10);

        let body : any = []
        for (const item of this.template) {
            const rowData = [item.sellerData.email,
                             item.propertyData.name,
                             dayjs(item.propertyData.createdAt).format('D[/]MM[/]YY'),
                             'R$ ' + item.propertyData.price, 
                             dayjs(item.propertyData.createdAt).format('D[/]MM[/]YY'),
                             'R$ ' + item.contractData.price,
                            ]
            body.push(rowData)
        }

        console.log(body)
        
        autoTable(doc, {
            head: [['Vendedor',
                    'Anúncio', 
                    'Data de criação', 
                    'Valor do anúncio',
                    'Data de venda',
                    'Valor acordado',
                ]],
            body: body,
        })

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    }

}

