import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-planartest',
  templateUrl: './planartest.component.html',
  styleUrls: ['./planartest.component.scss'],
  standalone:true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlanartestComponent {

  finish(event: any){
    console.log("finished: "+ event.detail)
  }
}
