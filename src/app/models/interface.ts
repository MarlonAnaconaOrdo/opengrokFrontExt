export interface results{
  className: string;
  path: string;
  method: string;
}


export interface MethodCallpOut{
  code:string;
  methodName:string;
  path:string;
  lineNumber:number;
  callBy: MethodCallpOut[];
  callTo: MethodCallpOut[] | null;
  classOrInterface: string;
  nameProject: String;
  idMethod: number;
}


export interface resultResponse{
  path:string;
  line:string;
  lineNumber:number;
  className:string;
}

  export interface entity{
    tableEntity:string;
    schemaEntity:string;
    idEntity:number;
    selected?: boolean;
  }


