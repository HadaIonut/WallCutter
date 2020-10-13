class WallMerger {

    private static _instance: WallMerger;

    private constructor() {
    }

    public static getInstance(): WallMerger {
        if (!WallMerger._instance) WallMerger._instance = new WallMerger();
        return WallMerger._instance;
    }

    /**
     * Returns the cos of the angle between 2 walls
     *
     * @param firstWall
     * @param secondWall
     * @private
     */
    private _calculateCosOfAngleBetween2Walls(firstWall, secondWall) {
        const magnitudeProduct = this._calculateWallMagnitude(firstWall) * this._calculateWallMagnitude(secondWall);
        return this._calculateDotProduct(firstWall, secondWall) / magnitudeProduct;
    }

    /**
     * Calculates the magnitude based on a line equation
     *
     * @param wallEquation
     * @private
     */
    private _calculateWallMagnitude(wallEquation: number[]) {
        return Math.sqrt(Math.pow(wallEquation[0], 2) + Math.pow(wallEquation[1], 2))
    }

    /**
     * Calculates the dot product between 2 walls
     *
     * @param firstWall
     * @param secondWall
     * @private
     */
    private _calculateDotProduct(firstWall: number[], secondWall: number[]): number {
        return firstWall[0] * secondWall[0] + firstWall[1] * secondWall[1];
    }

    /**
     * returns the line's equation based on coords
     * @example ai + bj = 0 => [a,b]
     *
     * @param wallCoords
     * @private
     */
    private _makeNormalVectorForAWall(wallCoords: number[]): number[] {
        return [wallCoords[2] - wallCoords[0], wallCoords[3] - wallCoords[1]]
    }

    /**
     * Part 2 of the calculation I stole from stackOverFlow that I do not really understand
     *
     * @param A - first point coords
     * @param B - second point coords
     * @param C - third point coords
     * @private
     */
    private ccw(A: number[], B: number[], C: number[]): boolean {
        return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])
    }

    /**
     * Some function that checks intersection of 2 lines I stole from stackOverFlow, I have no idea how it works
     *
     * @param firstWall - coords of the first wall
     * @param secondWall- coords of the second wall
     * @private
     */
    private _checkIntersection(firstWall: number[], secondWall: number[]): boolean {
        const A = [firstWall[0], firstWall[1]];
        const B = [firstWall[2], firstWall[3]];
        const C = [secondWall[0], secondWall[1]];
        const D = [secondWall[2], secondWall[3]];
        return (this.ccw(A, C, D) != this.ccw(B, C, D) && this.ccw(A, B, C) != this.ccw(A, B, D))
    }

    /**
     * Returns true if the target wall isn't linked with main wall
     *
     * @param mainWall
     * @param currentWall
     * @private
     */
    private _shouldIMerge(mainWall: any, currentWall: any): boolean {
        const linkedSegments = mainWall.getLinkedSegments().walls;
        for (const segment of linkedSegments) {
            if (segment === currentWall) return false;
        }
        return true;
    }

    /**
     * Returns a list of the walls that are overlapping with a main wall
     *
     * @param mainWallCoords - point values of the main wall
     * @param mainWall - main wall structure
     * @private
     */
    private _findOverlappingWalls(mainWallCoords: any, mainWall: any) {
        const walls = canvas.walls.objects.children;
        const mainWallEquation = this._makeNormalVectorForAWall(mainWallCoords);
        let toMergeList = [];

        walls.forEach((wall) => {
            if (!this._shouldIMerge(mainWall, wall)) return;
            const wallCoords = wall.data.c;
            const wallEquation = this._makeNormalVectorForAWall(wallCoords);
            const angleBetweenWalls = Math.acos(this._calculateCosOfAngleBetween2Walls(mainWallEquation, wallEquation))
            if (this._checkIntersection(mainWallCoords, wallCoords) && angleBetweenWalls < 0.5) toMergeList.push(wall);
            //TODO: using equation of a straight line add support for points that are exactly on the line
        })

        return toMergeList;
    }

    private _makeSlopeFromTwoPoints(firstPoint: [number, number], secondPoint: [number, number]): number {
        return (firstPoint[1] - secondPoint[1]) / (firstPoint[0] - secondPoint[0]);
    }

    private _makeLineEquation(line: number[]): any {
        const equation = {a: 0, b: -1, c: 0}
        const slope = this._makeSlopeFromTwoPoints([line[0], line[1]], [line[2], line[3]]);
        equation.a = slope;
        equation.c = -slope * line[0] + line[1]
        return {equation: equation, slope: slope};
    }

    /**
     * Here is another function that I cannot understand. If for some reason I have to touch this again, I will not.
     * This function has been sent by God, or by his real name @MBo on stackOverFlow, since it is made by God I cannot question him
     * So I do not dare edit this code.
     *
     * @param line - base line
     * @param point - point to be projected
     * @private
     */
    private _findProjectionOfPointsOnALine(line: number[], point: [number, number]): [number, number] {
        const CF = ((line[2] - line[0]) * (point[0] - line[0]) + (line[3] - line[1]) * (point[1] - line[1])) / (Math.pow(line[2] - line[0], 2) + Math.pow(line[3] - line[1], 2))
        return [Math.floor(line[0] + (line[2] - line[0]) * CF), Math.floor(line[1] + (line[3] - line[1]) * CF)];
    }

    private async _createNewWallFromPointsArray(pointsArray: any): Promise<void> {
        for (let index = 0; index < pointsArray.length - 1; index++) {
            // @ts-ignore
            await Wall.create({
                c: pointsArray[index].concat(pointsArray[index + 1])
            })
        }
    }

    public async mergeWalls(mainWall: any) {
        const wallsToMerge = this._findOverlappingWalls(mainWall.data.c, mainWall);
        const projectedPoints = [];
        projectedPoints.push([mainWall.data.c[0], mainWall.data.c[1]]);
        projectedPoints.push([mainWall.data.c[2], mainWall.data.c[3]]);
        console.log(wallsToMerge);
        for (const wall of wallsToMerge) {
            const firstPoint = this._findProjectionOfPointsOnALine(mainWall.data.c, [wall.data.c[0], wall.data.c[1]]);
            projectedPoints.push(firstPoint);
            const secondPoint = this._findProjectionOfPointsOnALine(mainWall.data.c, [wall.data.c[2], wall.data.c[3]]);
            projectedPoints.push(secondPoint);
            await wall.delete();
        }
        projectedPoints.sort();
        mainWall.release();
        mainWall.delete();
        await this._createNewWallFromPointsArray(projectedPoints);
    }
}

export default WallMerger.getInstance();