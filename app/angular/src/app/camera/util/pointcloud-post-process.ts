export class PointCloudPostProcess {

    orig_pointcloud: number[][];
    targ_pointcloud: number[][];

    constructor(pointcloud: number[][]) {
        this.orig_pointcloud = Array.from(pointcloud);
        this.targ_pointcloud = Array.from(pointcloud);
    }

    addGaussianNoise(percentage: number) {
        if (percentage > 1 || percentage < 0) {
            throw new RangeError("The value of 'percentage' should between 0 and 1");
        }

        
    }

}