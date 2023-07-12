import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { MethodCallpOut, entity, resultResponse } from 'src/app/models/interface';
import { HttpServicesService } from 'src/app/services/http-services.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  nameMethod: string="";
  showInformation:boolean=false;
  codePath:string=""
  methodSearched:any
  selectedMethodResult: {path: string, result: string} = {path: '', result: ''};
  selectedMethodCode: string = '';
  methodCodeMap: Map<string, string> = new Map();
  data: any;
  showTables = false;
  selectedEntity: entity | null = null;
  //entities: entity[] = [];  

  entities = [
    {
      tableEntity: 'Table1',
      schemaEntity: 'Schema1',
      idEntity: 1,
      selected: false
    },
    {
      tableEntity: 'Table2',
      schemaEntity: 'Schema2',
      idEntity: 2,
      selected: false
    },
    {
      tableEntity: 'Table3',
      schemaEntity: 'Schema3',
      idEntity: 3,
      selected: false
    },
    {
      tableEntity: 'Table4',
      schemaEntity: 'Schema4',
      idEntity: 4,
      selected: false
    },
    // ... más entidades
  ];

  results: any;

  selectedMethod: any;
  loading = false;
  error=false;
  escoger=false;
  selectedValue: string = '';

  constructor(private services:HttpServicesService,private messageService: MessageService) { 
    
  }

  ngOnInit(): void {
    console.log(this.entities);
  }

  setValue(value: string) {
    this.selectedValue = value;
  }

  goBack(){
this.escoger=false
  }



  findTables() {
    this.showTables = true;
    this.showInformation = false;
  }

  onCheckboxChange(selectedEntity: entity) {
    // Desmarcar todas las entidades excepto la seleccionada
    this.entities = this.entities.map(entity => {
        if (entity === selectedEntity) {
            return { ...entity, selected: true };
        } else {
            return { ...entity, selected: false };
        }
    });

    // Guardar la entidad seleccionada
    this.selectedEntity = selectedEntity;
}

  
  buscar() {
    console.log('Buscar la entidad: ', this.selectedEntity);
    // Aquí va la lógica de buscar la entidad seleccionada...
  }
  goBackError(){
    this.escoger=false
    this.error=false
      }
  //Servicio que busca  los metodos por medio de la  aplicación OpengrokExt
  buscarMetodos(){
  
    this.services.getMethodByName(this.nameMethod).subscribe(
      response=>{
        //Aqui aparecera el listado a escoger
        this.results=response
        this.error =false
        this.loading = false;
      }, error=>{

        this.loading = false;
         this.error =true
      }
    )
  }
  /*
  findTables(){
    this.services.getTablesByProyect(1).subscribe(
      response=>{
        this.entities=response;
      }, error=>{
        this.error =true
      }
    )
  }*/

  getMetodo(){
//Hace llamado de metodos con rutas

  }

  handleClick(value: any) {
    this.loading = true;

    this.services.CallHierrarchy(value).subscribe({
      next: (response) => {
        console.log(response);
        this.methodSearched = response;  // Aquí cambio `this.data` a `this.methodSearched`.
        this.escoger = true;
        this.loading = false;
        this.error = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
      },
    });

  }


  handleMethodClick(method: any) {
    console.log(method)
    this.selectedMethod = method;
    this.selectedMethodCode = this.methodCodeMap.get(method.methodName) || '';
  }

  createMethodCodeMap(method: MethodCallpOut) {
    if (method) {
      this.methodCodeMap.set(method.methodName, method.code);
      method.callBy.forEach((childMethod: MethodCallpOut) => {
        this.createMethodCodeMap(childMethod);
      });
    }
  }

}
