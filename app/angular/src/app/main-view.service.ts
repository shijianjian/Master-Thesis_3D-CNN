import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";

@Injectable()
export class MainViewService {
    
    public pointcloud: Subject<number[][]> = new BehaviorSubject<number[][]>([]);

}