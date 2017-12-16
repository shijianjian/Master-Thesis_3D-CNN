import * as nj from 'numjs';
import { PointCloudCalculations } from './pointcloud-loader';

export interface PCProcessParams {
    noise_percentage?: number;
    noise_variance?: number;
    x_ratio?: number;
    y_ratio?: number;
    z_ratio?: number;
}

export class PointCloudPostProcess {

    private orig_pointcloud: number[][];
    private targ_pointcloud: number[][];
    private noise: number[][] = [];
    private current_params: PCProcessParams;

    constructor(pointcloud: number[][]) {
        this.orig_pointcloud = Array.from(pointcloud);
    }

    process(param: PCProcessParams) {
        if (param == this.current_params) {
            return this.targ_pointcloud;
        }
        let targ_pointcloud = Array.from(this.orig_pointcloud);
        if (typeof this.current_params == 'undefined'
            || this.current_params.noise_percentage != param.noise_percentage
            || this.current_params.noise_variance != param.noise_variance)
        {
            this.noise = this.getGaussianNoise(this.orig_pointcloud, param.noise_percentage,param.noise_variance);
        }
        if (typeof this.current_params == 'undefined'
            || this.current_params.x_ratio != param.x_ratio
            || this.current_params.y_ratio != param.y_ratio
            || this.current_params.z_ratio != param.z_ratio)
        {
            if (this.noise.length > 0)
                targ_pointcloud = this.orig_pointcloud.concat(this.noise);
            
            targ_pointcloud = this.squeeze(targ_pointcloud, param.x_ratio, param.y_ratio, param.z_ratio)
        }
        this.targ_pointcloud = targ_pointcloud;
        return targ_pointcloud;
    }

    private getGaussianNoise(pointcloud: number[][], percentage: number, variance?: number) {
        if (percentage > 1 || percentage < 0) {
            throw new RangeError("The value of 'percentage' should between 0 and 1");
        }
        if (typeof variance == 'undefined') {
            variance = 1;
        }

        let noise_size = Math.floor(pointcloud.length * percentage);
        let ranges = PointCloudCalculations.findRanges(pointcloud);

        // let noise_x, noise_y, noise_z;
        let pos, pair = [];
        let noise_x = nj.random(noise_size).tolist();
        let noise_y = nj.random(noise_size).tolist();
        let noise_z = nj.random(noise_size).tolist();

        let res = [];
        for(let i=0; i<noise_size; i++) {
            pos = Math.floor(Math.random()*pointcloud.length);
            pair = [0, 0, 0];
            pair[0] = pointcloud[pos][0] + (noise_x[i]-0.5)*(ranges.X_MAX - ranges.X_MIN)*variance;
            pair[1] = pointcloud[pos][1] + (noise_y[i]-0.5)*(ranges.Y_MAX - ranges.Y_MIN)*variance;
            pair[2] = pointcloud[pos][2] + (noise_z[i]-0.5)*(ranges.Z_MAX - ranges.Z_MIN)*variance;
            res.push(pair);
        }
        return res;
    }

    private squeeze(pointcloud: number[][], x_ratio?: number, y_ratio?: number, z_ratio?: number) {
        if(typeof x_ratio == 'undefined') { x_ratio = 0 }
        if(typeof y_ratio == 'undefined') { y_ratio = 0 }
        if(typeof z_ratio == 'undefined') { z_ratio = 0 }

        if (x_ratio ===0 && x_ratio === y_ratio && x_ratio === z_ratio) {
            return pointcloud;
        }

        let vX = (100 - x_ratio)/100;
        let vY = (100 - y_ratio)/100;
        let vZ = (100 - z_ratio)/100;

        let x, y, z, res=[];
        for(let i=0; i< pointcloud.length; i++) {
            x = pointcloud[i][0]*vX;
            y = pointcloud[i][1]*vY;
            z = pointcloud[i][2]*vZ;
            res.push([x, y, z]);
        }
        return res;
    }
    
}