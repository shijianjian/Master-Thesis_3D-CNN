import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [`
		:host {
			display: inline-block;
			width: 100vw;
			height: 100vh;
		}
		.sidenav-container{
			position: absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
		}
	`]
})
export class AppComponent {
	
	segs = [];
	opened = false;

	onSegments(e: number[][][]) {
		this.segs = e;
		this.opened = true;
	}

	onMenuToggle(e: boolean) {
		this.opened = !this.opened;
	}

	get showMenu() {
		return this.segs && this.segs.length>0 ? true : false;
	}

}
