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
  entities: entity[] = [];
  routesByTable: any[] = [];
  index=true;


  results: any;

  selectedMethod: any;
  loading = false;
  error=false;
  escoger=false;
  selectedValue: string = '';
  projects:any;
  selectedProject: any;
  methodTables=false;
  constructor(private services:HttpServicesService,private messageService: MessageService) {

  }

  ngOnInit(): void {
    console.log(this.entities);
    this.getProjects();

  }


  getProjects(){

    this.services.getProjects().subscribe(response=>{

      this.projects=response
    }, error=>{

      console.log(error)
    })
  }

  setValue(value: string) {
    this.selectedValue = value;
  }

  printSelectedProject(): void {
    console.log(this.selectedProject);
  }

  goBack(){
this.escoger=false
  }



  findTables() {
    this.loading=true;
    this.error=false;
    this.methodTables=false;
    if (this.selectedProject !== null) {
      const idProyect = this.selectedProject.idProject;
      this.showTables = true;
     this.services.getTablesByProyect(idProyect).subscribe(
      response=>{
        this.methodTables=false;
        this.loading=false
        this.error =false
      this.entities=response
      }, error=>{
        this.methodTables=false;
        this.loading=false
        this.error =true
            }
    )
    }
  }


  findMethodsByTable() {
//limpia la ruta
    this.routesByTable=[]
    this.methodTables=false;
    this.error=false;
    this.loading=true;
    if (this.selectedProject !== null) {
      const idProyect = this.selectedProject.idProject;
      if (this.selectedEntity !== null) {
        const idEntity = this.selectedEntity.idEntity;


        this.services.getRoutesMethodsByTable(idEntity,idProyect).subscribe(
          response=>{
            this.routesByTable=response
            this.loading=false;
            this.error=false
            this.methodTables=true;
            //this.routesByTable=response
          }, error=>{
            this.methodTables=false;
            this.loading=false
            this.error =true
          }
        )
      }
    }
  }

  indexar(){
    this.services.indexar(this.selectedProject.idProject).subscribe(
      response=>{

        this.services.generateTree().subscribe(
          response=>{
            this.messageService.add({ severity: 'success', summary: 'Indexación completa', detail: 'Se completo el proceso' });
            this.index=false;
          },error=>{
            this.messageService.add({ severity: 'error', summary: 'Indexación incompleta', detail: 'No se completó el proceso' });

            this.index=false;
          }
        )
      },error=>{
        this.messageService.add({ severity: 'error', summary: 'Indexación incompleta', detail: 'No se completó el proceso' });
        this.index=true;
      }
    )
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
    this.showTables=false;
    this.showInformation=true;
    this.methodTables=false
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
        this.methodSearched = [response];  // Aquí cambio `this.data` a `this.methodSearched`.
      //   this.methodSearched =[ {
      //     code: `CREATE OR REPLACE PROCEDURE APP_SEL_PERSONAL.delete_candidate
      //   (
      //       in_candidate_id INTEGER,
      //       in_user_id VARCHAR2
      //   )
      //   IS
      //   BEGIN

      //       DELETE FROM APP_SEL_PERSONAL.PERSONAL_INFORMATION_DATA pid
      //       WHERE candidate_id = in_candidate_id  AND
      //               EXISTS (
      //                   SELECT 1 FROM PROJECT p, CANDIDATE c
      //                       WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //               );

      //       DELETE FROM APP_SEL_PERSONAL.ECONOMIC_INFORMATION_DATA
      //       WHERE candidate_id = in_candidate_id AND
      //               EXISTS (
      //                   SELECT 1 FROM PROJECT p, CANDIDATE c
      //                       WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //               );

      //       DELETE FROM APP_SEL_PERSONAL.ACADEMIC_INFORMATION_DATA
      //       WHERE candidate_id = in_candidate_id AND
      //               EXISTS (
      //                   SELECT 1 FROM PROJECT p, CANDIDATE c
      //                       WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //               );
      //       -- delete candidate
      //       DELETE FROM APP_SEL_PERSONAL.CANDIDATE c
      //       WHERE candidate_id = in_candidate_id AND
      //               EXISTS (
      //                   SELECT 1 FROM PROJECT p
      //                       WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //               );

      //   END; SERVED BY {OPENGROK LAST INDEX UPDATE: WED JUL 12 16:05:09 UTC 2023`,
      //     methodName: "DELETE_CANDIDATE",
      //     path: "/APP_SEL_PERSONAL-FULL/DB/plsql/procedures/DELETE_CANDIDATE_PROCEDURE.sql",
      //     lineNumber: 8,
      //     classOrInterface: null,
      //     callBy: [
      //       {
      //         code: "@Override\r\npublic void delete(Long candidateId, UserApp user) {\r\n    jdbcTemplate.update(\"CALL delete_candidate(?,?)\", candidateId, user.getUserId());\r\n}",
      //         methodName: "delete",
      //         path: "/APP_SEL_PERSONAL-FULL/Backend_API/src/main/java/com/segurosbolivar/techcamp/repositories/candidates/implementation/CandidateRepositoryImp.java",
      //         lineNumber: 60,
      //         classOrInterface: "CandidateRepositoryI",
      //         callBy: [
      //           {
      //             code: "@Override\r\npublic void deleteCandidate(Long candidateId, UserApp user) {\r\n    candidateRepository.delete(candidateId, user);\r\n}",
      //             methodName: "deleteCandidate",
      //             path: "/APP_SEL_PERSONAL-FULL/Backend_API/src/main/java/com/segurosbolivar/techcamp/services/implementations/CandidateServiceImp.java",
      //             lineNumber: 55,
      //             classOrInterface: "CandidateServiceI",
      //             callBy: [
      //               {
      //                 code: "@Override\r\n@DeleteMapping(\"/delete/{candidateId}\")\r\npublic ResponseEntity<ResponseMessage> deleteCandidate(@RequestHeader String authorization, @PathVariable Long candidateId) {\r\n    UserApp user = userService.findByToken(authorization.substring(7)).get();\r\n    try {\r\n        candidateService.deleteCandidate(candidateId, user);\r\n    } catch (Exception e) {\r\n        e.printStackTrace();\r\n        return new ResponseEntity<ResponseMessage>(new ResponseMessage(\"Algo salio mal, intente mas tarde\"), HttpStatus.INTERNAL_SERVER_ERROR);\r\n    }\r\n    return new ResponseEntity<ResponseMessage>(new ResponseMessage(\"Eliminado correctamente\"), HttpStatus.OK);\r\n}",
      //                 methodName: "deleteCandidate",
      //                 path: "/APP_SEL_PERSONAL-FULL/Backend_API/src/main/java/com/segurosbolivar/techcamp/restcontroller/implementation/CandidateControllerImp.java",
      //                 lineNumber: 121,
      //                 classOrInterface: "CandidateControllerI",
      //                 callBy: [
      //                   {
      //                     code: "deleteCandidate(candidateId: number): Observable<any> {\nreturn this.http.delete(`${this.baseUrl}/candidates/delete/${candidateId}`, { headers: this.headers() })\n}\n",
      //                     methodName: "deleteCandidate",
      //                     path: "/APP_SEL_PERSONAL-FULL/Frontend/src/app/services/backend-request.service.ts",
      //                     lineNumber: 174,
      //                     classOrInterface: "BackendRequestService",
      //                     callBy: [
      //                       {
      //                         code: "deleteCandidate(candidateId: number) {\nthis.backendRequest.refreshToken().subscribe({\nnext:(res)=>{\nsetTimeout(()=>{\nthis.backendRequest.deleteCandidate(candidateId).subscribe({\nnext: (res) => {\nthis.showMessage.emitChange({ severity: 'success', summary: res.message })\nlet index = -1;\nfor (let i = 0; i < this.candidates.length; i++) {\nif (this.candidates[i].candidateId == candidateId) {\nindex = i;\nbreak;\n}\n}\nthis.candidates.splice(index, 1);\n}\n})\n},50)\n}\n})\n}\n",
      //                         methodName: "deleteCandidate",
      //                         path: "/APP_SEL_PERSONAL-FULL/Frontend/src/app/pages/main-page/main-page.component.ts",
      //                         lineNumber: 160,
      //                         classOrInterface: "MainPageComponent",
      //                         callBy: [],
      //                         callTo: null,
      //                         nameProject: "APP_SEL_PERSONAL-FULL",
      //                         idMethod: 10
      //                       }
      //                     ],
      //                     callTo: null,
      //                     nameProject: "APP_SEL_PERSONAL-FULL",
      //                     idMethod: 9
      //                   }
      //                 ],
      //                 callTo: null,
      //                 nameProject: "APP_SEL_PERSONAL-FULL",
      //                 idMethod: 8
      //               }
      //             ],
      //             callTo: null,
      //             nameProject: "APP_SEL_PERSONAL-FULL",
      //             idMethod: 7
      //           }
      //         ],
      //         callTo: null,
      //         nameProject: "APP_SEL_PERSONAL-FULL",
      //         idMethod: 6
      //       },{
      //         code: `CREATE OR REPLACE PROCEDURE APP_SEL_PERSONAL.delete_candidate
      //       (
      //           in_candidate_id INTEGER,
      //           in_user_id VARCHAR2
      //       )
      //       IS
      //       BEGIN

      //           DELETE FROM APP_SEL_PERSONAL.PERSONAL_INFORMATION_DATA pid
      //           WHERE candidate_id = in_candidate_id  AND
      //                   EXISTS (
      //                       SELECT 1 FROM PROJECT p, CANDIDATE c
      //                           WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //                   );

      //           DELETE FROM APP_SEL_PERSONAL.ECONOMIC_INFORMATION_DATA
      //           WHERE candidate_id = in_candidate_id AND
      //                   EXISTS (
      //                       SELECT 1 FROM PROJECT p, CANDIDATE c
      //                           WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //                   );

      //           DELETE FROM APP_SEL_PERSONAL.ACADEMIC_INFORMATION_DATA
      //           WHERE candidate_id = in_candidate_id AND
      //                   EXISTS (
      //                       SELECT 1 FROM PROJECT p, CANDIDATE c
      //                           WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //                   );
      //           -- delete candidate
      //           DELETE FROM APP_SEL_PERSONAL.CANDIDATE c
      //           WHERE candidate_id = in_candidate_id AND
      //                   EXISTS (
      //                       SELECT 1 FROM PROJECT p
      //                           WHERE p.USER_ID = in_user_id AND c.CANDIDATE_ID = in_candidate_id AND c.PROJECT_ID  = p.PROJECT_ID
      //                   );

      //       END; SERVED BY {OPENGROK LAST INDEX UPDATE: WED JUL 12 16:05:09 UTC 2023`,
      //         methodName: "DELETE_CANDIDATE",
      //         path: "/APP_SEL_PERSONAL-FULL/DB/plsql/procedures/DELETE_CANDIDATE_PROCEDURE.sql",
      //         lineNumber: 8,
      //         classOrInterface: null,
      //         callBy: [
      //           {
      //             code: "@Override\r\npublic void delete(Long candidateId, UserApp user) {\r\n    jdbcTemplate.update(\"CALL delete_candidate(?,?)\", candidateId, user.getUserId());\r\n}",
      //             methodName: "delete",
      //             path: "/APP_SEL_PERSONAL-FULL/Backend_API/src/main/java/com/segurosbolivar/techcamp/repositories/candidates/implementation/CandidateRepositoryImp.java",
      //             lineNumber: 60,
      //             classOrInterface: "CandidateRepositoryI",
      //             callBy: [
      //               {
      //                 code: "@Override\r\npublic void deleteCandidate(Long candidateId, UserApp user) {\r\n    candidateRepository.delete(candidateId, user);\r\n}",
      //                 methodName: "deleteCandidate",
      //                 path: "/APP_SEL_PERSONAL-FULL/Backend_API/src/main/java/com/segurosbolivar/techcamp/services/implementations/CandidateServiceImp.java",
      //                 lineNumber: 55,
      //                 classOrInterface: "CandidateServiceI",
      //                 callBy: [
      //                   {
      //                     code: "@Override\r\n@DeleteMapping(\"/delete/{candidateId}\")\r\npublic ResponseEntity<ResponseMessage> deleteCandidate(@RequestHeader String authorization, @PathVariable Long candidateId) {\r\n    UserApp user = userService.findByToken(authorization.substring(7)).get();\r\n    try {\r\n        candidateService.deleteCandidate(candidateId, user);\r\n    } catch (Exception e) {\r\n        e.printStackTrace();\r\n        return new ResponseEntity<ResponseMessage>(new ResponseMessage(\"Algo salio mal, intente mas tarde\"), HttpStatus.INTERNAL_SERVER_ERROR);\r\n    }\r\n    return new ResponseEntity<ResponseMessage>(new ResponseMessage(\"Eliminado correctamente\"), HttpStatus.OK);\r\n}",
      //                     methodName: "deleteCandidate",
      //                     path: "/APP_SEL_PERSONAL-FULL/Backend_API/src/main/java/com/segurosbolivar/techcamp/restcontroller/implementation/CandidateControllerImp.java",
      //                     lineNumber: 121,
      //                     classOrInterface: "CandidateControllerI",
      //                     callBy: [
      //                       {
      //                         code: "deleteCandidate(candidateId: number): Observable<any> {\nreturn this.http.delete(`${this.baseUrl}/candidates/delete/${candidateId}`, { headers: this.headers() })\n}\n",
      //                         methodName: "deleteCandidate",
      //                         path: "/APP_SEL_PERSONAL-FULL/Frontend/src/app/services/backend-request.service.ts",
      //                         lineNumber: 174,
      //                         classOrInterface: "BackendRequestService",
      //                         callBy: [
      //                           {
      //                             code: "deleteCandidate(candidateId: number) {\nthis.backendRequest.refreshToken().subscribe({\nnext:(res)=>{\nsetTimeout(()=>{\nthis.backendRequest.deleteCandidate(candidateId).subscribe({\nnext: (res) => {\nthis.showMessage.emitChange({ severity: 'success', summary: res.message })\nlet index = -1;\nfor (let i = 0; i < this.candidates.length; i++) {\nif (this.candidates[i].candidateId == candidateId) {\nindex = i;\nbreak;\n}\n}\nthis.candidates.splice(index, 1);\n}\n})\n},50)\n}\n})\n}\n",
      //                             methodName: "deleteCandidate",
      //                             path: "/APP_SEL_PERSONAL-FULL/Frontend/src/app/pages/main-page/main-page.component.ts",
      //                             lineNumber: 160,
      //                             classOrInterface: "MainPageComponent",
      //                             callBy: [],
      //                             callTo: null,
      //                             nameProject: "APP_SEL_PERSONAL-FULL",
      //                             idMethod: 10
      //                           }
      //                         ],
      //                         callTo: null,
      //                         nameProject: "APP_SEL_PERSONAL-FULL",
      //                         idMethod: 9
      //                       }
      //                     ],
      //                     callTo: null,
      //                     nameProject: "APP_SEL_PERSONAL-FULL",
      //                     idMethod: 8
      //                   }
      //                 ],
      //                 callTo: null,
      //                 nameProject: "APP_SEL_PERSONAL-FULL",
      //                 idMethod: 7
      //               }
      //             ],
      //             callTo: null,
      //             nameProject: "APP_SEL_PERSONAL-FULL",
      //             idMethod: 6
      //           }
      //         ],
      //         callTo: null,
      //         nameProject: "APP_SEL_PERSONAL-FULL",
      //         idMethod: 5
      //       }
      //     ],
      //     callTo: null,
      //     nameProject: "APP_SEL_PERSONAL-FULL",
      //     idMethod: 5
      //  } ]
          // Aquí cambio `this.data` a `this.methodSearched`.
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
