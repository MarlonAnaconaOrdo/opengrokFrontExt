import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { MethodCallpOut } from 'src/app/models/interface';
import { HttpServicesService } from 'src/app/services/http-services.service';

@Component({
  selector: 'app-method',
  templateUrl: './method-component.component.html',
  styleUrls: ['./method-component.component.css']
})
export class MethodComponentComponent  implements OnChanges {

  @Input() method1: MethodCallpOut={
    code:"",
    callBy:[],
    callTo:[],
    methodName:"",
    path:"",
    lineNumber:0,
    classOrInterface:"",
    idMethod:0,
    nameProject:""
  };

  @Input() method: MethodCallpOut[] = [];

  @Output() methodClicked = new EventEmitter<MethodCallpOut>();
  selectedMethodResult: {path: string, result: string} = {path: '', result: ''};
  showCode: boolean[] = [];
  showCodeOnly: boolean=false;
  selectedMethodForCode: MethodCallpOut | null = null;
  displayCodeForMethod: Map<string, boolean> = new Map();
  methodCodeMap: {classOrInterface: string; code: string; path: string}[]=[]
  displayCodeForRoute: Map<string, boolean> = new Map();
  displayPathForRoute: Map<string, boolean> = new Map();

  constructor(private services:HttpServicesService) { }
  @Input() selectedMethodCode: string = '';

  traversedMethods: any[] = [];

  ngOnChanges() {
    if (this.method) {
      this.traversedMethods = this.traverseMethod(this.method);
      console.log(this.traversedMethods);
    }
  }



  handleClick(method: any) {
    this.methodClicked.emit(method);
  }

  hasAnyCalls(method: MethodCallpOut): boolean {
    return method.callBy.length > 0 ;
  }
  traverseMethod(methods: MethodCallpOut[], prefix: { classOrInterface: string, code: string, path: string, methodName: string }[] = []): { route: { classOrInterface: string, code: string, path: string, methodName: string }[], method: MethodCallpOut }[] {
    let result: { route: { classOrInterface: string, code: string, path: string, methodName: string }[], method: MethodCallpOut }[] = [];
    for (let method of methods) {
      let route = [...prefix];
      if (method.classOrInterface !== this.method[0].classOrInterface) {
        route.push({ classOrInterface: method.classOrInterface, code: method.code, path: method.path, methodName: method.methodName });
      }
      if (method.callBy.length === 0) {
        result.push({ route: route, method: method });
      } else {
        let childResults = this.traverseMethod(method.callBy, route);
        result.push(...childResults);
      }
    }
    return result;
  }


  toggleCodeView(route: string, pathIndex: number, segmentIndex: number) {
    const key = `${route}-${pathIndex}-${segmentIndex}`;
    const currentStatus = this.displayCodeForRoute.get(key) || false;
    this.displayCodeForRoute.set(key, !currentStatus);
}


isHighlighted(line: string, methodName: string): boolean {
  return line.includes(methodName);
}

}
