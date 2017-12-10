import * as nj from 'numjs';
import { PointCloudCalculations } from './pointcloud-loader';

export class PointCloudPostProcess {

    orig_pointcloud: number[][];
    targ_pointcloud: number[][];

    constructor(pointcloud: number[][]) {
        this.orig_pointcloud = Array.from(pointcloud);
    }

    addGaussianNoise(percentage: number) {
        if (percentage > 1 || percentage < 0) {
            throw new RangeError("The value of 'percentage' should between 0 and 1");
        }
        this.targ_pointcloud = Array.from(this.orig_pointcloud);

        let noise_size = this.orig_pointcloud.length * percentage;
        let ranges = PointCloudCalculations.findRanges(this.orig_pointcloud);

        // let noise_x, noise_y, noise_z;
        let pos, pair = [];
        let noise_x = nj.random(noise_size).tolist();
        let noise_y = nj.random(noise_size).tolist();
        let noise_z = nj.random(noise_size).tolist();
        
        for(let i=0; i<noise_size; i++) {
            
            pos = Math.floor(Math.random()*this.orig_pointcloud.length);
            pair = [0, 0, 0];
            pair[0] = this.orig_pointcloud[pos][0] + (noise_x[i]-0.5)*(ranges.X_MAX - ranges.X_MIN);
            pair[1] = this.orig_pointcloud[pos][1] + (noise_y[i]-0.5)*(ranges.Y_MAX - ranges.Y_MIN);
            pair[2] = this.orig_pointcloud[pos][2] + (noise_z[i]-0.5)*(ranges.Z_MAX - ranges.Z_MIN);
            this.targ_pointcloud.push(pair);
        }
        return this.targ_pointcloud;
    }
    
}