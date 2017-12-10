import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styles: [`
	.app-main-view {
		display: flex;
		padding-top: 30px;
		justify-content: space-between;
	}
	`]
})
export class AppComponent {
	pointcloud;
	segs = [];

	onSegemenets(e: JSON) {
		let segs = []
		for (let key in e) {
			segs.push(e[key]);
		}
		this.segs = Array.from(segs);
	}

	onPointcloud(e: number[][]) {
		this.pointcloud = Array.from(e);
	}

}
